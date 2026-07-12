# 约会邀请网页 💌

一个手机端的多步骤约会邀请小网页，仿你在抖音看到的那种：
邀请 → 二次确认 → 选日期 → 选时间 → 选吃什么 → 成交卡（撒花 + 一键加日历 + 微信通知本人）。

**已内置的加料：**
- 🐻 **Kanye 熊开场**：第一屏整屏铺满 Kanye 熊骑士花纹壁纸，邀请卡居中（`cover` 铺满，网页/手机都自动适配）
- 🐦 **Kanye 彩蛋**：第一屏卡片图标是 Kanye 熊；第二屏「你真的点了愿意？」头像是 Kanye 眨眼；最后一页头像是 Kanye Kirby（只抠掉周围黑底、脸保留）
- ⏳ 成交后**持久倒计时**：她关掉再打开，还是继续倒数到约会那一刻（存在她浏览器本地）
- 🎵 **背景音乐**：Kanye · Bound 2，从高潮（52 秒）开始循环，**用本地 mp3，国内无需梯子**（第一次点击页面时响，右下角可开关）
- 想重新体验：网址后面加 `?reset` 就清空重来

## 文件

- `index.html` —— 全部界面和交互，纯静态
- `api/notify.js` —— Vercel 函数，把对方的选择推送到你微信（可选）
- `bears_bg.jpg` —— 第一屏整屏花纹壁纸（Kanye 熊骑士）
- `bear.png` —— 第一屏卡片图标：Kanye 熊（已抠掉白底）
- `kanye_wink.jpg` —— 第二屏眨眼头像
- `kirby.png` —— 最后一页 Kanye Kirby 头像（只抠掉周围黑底、脸保留）
- `bound2.mp3` —— 背景音乐（Bound 2，已提取好；供个人使用）

## 一、改成你的（只动 `index.html` 顶部的 `CONFIG`）

```js
const CONFIG = {
  // 第一屏卡片图标：Kanye 熊（bear.png，已抠掉白底）
  avatar: { image: "bear.png", emoji: "🐶", fit: "contain", bg: "#ff2d9b" },
  // 最后一页头像：Kanye Kirby（kirby.png，只抠掉周围黑底、脸保留）
  finalAvatar: { image: "kirby.png", emoji: "🐶", fit: "contain", bg: "#ffffff" },

  // Kanye 彩蛋：wink = 第二屏眨眼头像（第一屏花纹壁纸 bears_bg.jpg 在 CSS 的 body.holding 里换）
  kanye: { wink: "kanye_wink.jpg" },

  // 背景音乐：优先本地 mp3（国内可用），没有 mp3 时才退回 YouTube；start = 从第几秒开始
  music: { mp3: "bound2.mp3", videoId: "BBAtAM7vtgc", start: 52, enabled: true },

  askTitle: "可以和我一起约会嘛？ ！🌸",
  askSub:   "系统检测到：对方已经紧张到开始写网页了。",
  finalLine: "{date} {time}，我们去吃{food}。带好胃口，我带好路线。",
  times: ["中午 12:00", "傍晚 17:00", ...],
  foods: [{e:"🍕",n:"披萨"}, ...],
  notifyEndpoint: "/api/notify"
}
```

> 🎵 音乐用的是本地 `bound2.mp3`，**国内不用梯子也能响**；需通过 http/https 打开
> （Vercel 部署 或 本地 `python3 -m http.server`），直接双击 `file://` 打开时不会响，其它功能正常。
> 想换歌：把新 mp3 放进文件夹、改 `music.mp3` 文件名、调 `start` 秒数即可。

## 二、部署到 Vercel（免费，几分钟）

1. 把整个 `date-invite` 文件夹传到一个 GitHub 仓库
2. 打开 https://vercel.com → New Project → 选这个仓库 → Deploy
3. 部署完会给你一个链接（形如 `https://xxx.vercel.app`），发给对方即可

> 只要静态页、不需要通知的话，到这步就完事了。

## 三、（可选）她答应后微信通知你

在 Vercel 项目 **Settings → Environment Variables** 里配置任一：

**方式 A：Server酱（最简单，直接推到你微信）**
- 打开 https://sct.ftqq.com ，微信扫码登录，复制你的 `SendKey`
- 在 Vercel 加环境变量：`SERVERCHAN_KEY` = 你的 SendKey

**方式 B：企业微信群机器人**
- 在企业微信群里「添加群机器人」，复制它的 Webhook URL
- 在 Vercel 加环境变量：`WECOM_WEBHOOK` = 那个完整 URL

配完 **重新 Deploy 一次** 生效。之后对方一选好时间地点，你微信就会收到：

> 🎉 她答应和你约会啦！
> 📅 日期：7月15日 ⏰ 时间：傍晚17:00 🍽️ 想吃：火锅

没配通知也不影响，成交卡会提示对方「截图发给你」。

## 本地预览

```bash
cd date-invite
python3 -m http.server 4321
# 浏览器打开 http://localhost:4321
```
（本地不会触发微信通知，属正常，成交卡照常显示。）
