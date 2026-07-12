// Vercel Serverless Function —— 她选完约会，把结果推送给你
// 部署后在 Vercel 项目 Settings → Environment Variables 里配置以下任一（配哪个用哪个，可多配）：
//   SERVERCHAN_KEY   Server酱 的 SendKey —— 直接推到你【微信】（去 https://sct.ftqq.com 微信扫码免费拿）
//   FEISHU_WEBHOOK   飞书群机器人的完整 Webhook URL —— 推到你的【飞书】
//   WECOM_WEBHOOK    企业微信群机器人的完整 Webhook URL —— 推到你的【企业微信】
// 密钥只存在服务端（Vercel），对方看不到。

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method not allowed" });
    return;
  }

  // 兼容 body 是对象或字符串两种情况
  let body = req.body || {};
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const { date = "", time = "", food = "", summary = "" } = body;

  const title = "🎉 她答应和你约会啦！";
  const text = `${title}\n\n📅 日期：${date}\n⏰ 时间：${time}\n🍽️ 想吃：${food}\n\n（${summary}）\n准时去接她 ❤️`;

  const tasks = [];

  // 1) Server酱 → 直接推到你微信
  if (process.env.SERVERCHAN_KEY) {
    tasks.push(
      fetch(`https://sctapi.ftqq.com/${process.env.SERVERCHAN_KEY}.send`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ title, desp: text }).toString(),
      }).catch((e) => ({ error: String(e) }))
    );
  }

  // 2) 飞书群机器人
  if (process.env.FEISHU_WEBHOOK) {
    tasks.push(
      fetch(process.env.FEISHU_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msg_type: "text", content: { text } }),
      }).catch((e) => ({ error: String(e) }))
    );
  }

  // 3) 企业微信群机器人
  if (process.env.WECOM_WEBHOOK) {
    tasks.push(
      fetch(process.env.WECOM_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msgtype: "markdown", markdown: { content: text } }),
      }).catch((e) => ({ error: String(e) }))
    );
  }

  if (tasks.length === 0) {
    // 没配任何通道也别报错，前端会优雅降级为“记得截图”
    res.status(200).json({ ok: false, error: "no channel configured" });
    return;
  }

  try {
    await Promise.all(tasks);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e) });
  }
};
