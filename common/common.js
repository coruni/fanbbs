export function shareTap(provider, type, scene, title, summary, href, imageUrl) {
	console.log(provider, type)
	// type
	// 0	图文	weixin、sinaweibo
	// 1	纯文字	weixin、qq
	// 2	纯图片	weixin、qq
	// 3	音乐	weixin、qq
	// 4	视频	weixin、sinaweibo
	// 5	小程序	weixin

	// scene
	// WXSceneSession	分享到聊天界面
	// WXSceneTimeline	分享到朋友圈
	// WXSceneFavorite	分享到微信收藏
	uni.share({
		provider,
		type,
		scene,
		title,
		summary,
		href,
		imageUrl,
		success: (res) => {
			uni.$u.toast('分享成功')
		}
	})

}

export function filterHtml(text) {
	var text = text.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
	text = text.replace(/[|]*\n/, ''); //去除行尾空格
	text = text.replace(/&npsp;/gi, ''); //去掉npsp
	return text;
}