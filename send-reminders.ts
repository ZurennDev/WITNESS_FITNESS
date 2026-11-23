import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

webpush.setVapidDetails(
  Deno.env.get("VAPID_SUBJECT")!,
  Deno.env.get("VAPID_PUBLIC")!,
  Deno.env.get("VAPID_PRIVATE")!,
);

Deno.serve(async (req) => {
  if (req.headers.get("x-cron-secret") !== Deno.env.get("CRON_SECRET")) {
    return new Response("unauthorized", { status: 401 });
  }
  const db = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { data: subs } = await db.from("push_subs").select("endpoint,sub,tz,user_id");
  if (!subs?.length) return new Response("0");

  const ids = [...new Set(subs.map((s) => s.user_id))];
  const { data: rows } = await db.from("app_state").select("user_id,state").in("user_id", ids);
  const rem = new Map((rows ?? []).map((r) => [r.user_id, r.state?.rem ?? []]));

  let sent = 0;
  for (const s of subs) {
    let now = "";
    try {
      now = new Date().toLocaleTimeString("en-GB", {
        timeZone: s.tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23",
      });
    } catch {
      continue;
    }
    for (const r of rem.get(s.user_id) ?? []) {
      if (!r.on || r.time !== now) continue;
      try {
        await webpush.sendNotification(
          s.sub,
          JSON.stringify({ title: "Witness Fitness", body: String(r.label || "Time to move") }),
        );
        sent++;
      } catch (e) {
        if (e.statusCode === 404 || e.statusCode === 410) {
          await db.from("push_subs").delete().eq("endpoint", s.endpoint);
        }
      }
    }
  }
  return new Response(String(sent));
});
