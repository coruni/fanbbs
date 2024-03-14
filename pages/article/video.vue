<template>
	<z-paging-swiper>
		<template #top>
			<yingbing-video :autoplay="false" style="height: 500rpx;background: black;" :poster="video.poster"
				:src="video.src" ref="video" :title="article.title">
			</yingbing-video>
			<u-row style="padding: 5rpx 30rpx;border-bottom: #f7f7f7 1rpx solid;">
				<z-tabs :list="list" :scrollCount="0" :current="swiperIndex" active-color="#ff0800"
					bar-animate-mode="worm" ref="tabs" bgColor="transparent" @change="tabsChange"></z-tabs>
				<u-col :span="4.5">
					<uv-input disabled shape="circle" style="padding: 5rpx 10rpx;">
						<view slot="suffix" style="display: flex;align-items: center;padding: 0 10rpx;">
							<i class="mgc_comment_line" style="font-size: 40rpx;"></i>
						</view>
					</uv-input>
				</u-col>
			</u-row>
		</template>

		<swiper :current="swiperIndex" @transition="swiperTransition" @animationfinish="swiperAnimationfinish"
			class="swiper">
			<swiper-item>
				<scroll-view scroll-y style="height: 100%;" @scrolltolower="scrolltolower('article')">
					<view style="padding: 30rpx;">
						<u-row justify="space-between">
							<u-row>
								<u-avatar :src="article && article.authorInfo && article.authorInfo.avatar"
									size="30"></u-avatar>
								<view style="margin-left: 20rpx;display: flex;flex-direction: column;">
									<text style="font-size: 30rpx;"
										:class="{'vipname':article.authorInfo && article.authorInfo.isVip}">{{article && article.authorInfo && article.authorInfo.screenName?article.authorInfo.screenName:article && article.authorInfo &&article.authorInfo.name}}</text>
									<text style="font-size: 24rpx;"
										class="u-line-1 text">{{article && article.authorInfo &&  article.authorInfo.introduce}}</text>
								</view>
							</u-row>
							<view style="flex-shrink: 0;">
								<u-button :plain="article && article.authorInfo&& !article.authorInfo.isFollow"
									shape="circle" hover-class="button_hover"
									:color="article && article.authorInfo&& article.authorInfo.isFollow?'#ff08000f':'#ff0800'"
									style="width:160rpx;height:65rpx;"
									:style="{color:article && article.authorInfo&& article.authorInfo.isFollow?'black':'#ff0800'}"
									:text="article && article.authorInfo&& article.authorInfo.isFollow?'已关注':'关注'"
									class="follow" @click="$emit('follow',article.authorId)"></u-button>
							</view>
						</u-row>
					</view>
					<view style="padding: 30rpx;">
						<u-row justify="space-between" @click="showInfo =!showInfo">
							<text>{{article.title}}</text>
							<i class="mgc_right_line icon" :class="{'icon-active':showInfo}"></i>
						</u-row>
						<view class="info-panel" :class="{'info-panel-active':showInfo}">
							<view class="chlid">
								<uv-parse :content="article.text" class="text" selectable></uv-parse>
								<view style="margin-top: 30rpx;display: flex;flex-wrap: wrap;" v-if="article.tag">
									<block v-for="(item,index) in article.tag" :key="index">
										<view>{{item.name}}</view>
									</block>
								</view>
							</view>
						</view>
					</view>
					<view style="padding: 30rpx;">
						<block v-for="(item,index) in articleList" :key="index">
							<u-row style="margin-bottom: 20rpx;height: 150rpx;" @click="goArticle(item)">
								<image :src="item.images[0]" mode="aspectFill"
									style="width: 260rpx;height: 150rpx;border-radius: 10rpx;flex-shrink: 0;"></image>
								<view
									style="display: flex;flex-direction: column;margin-left: 20rpx;height: 100%;justify-content: space-between;flex: 1;">
									<text class="u-line-1">{{item.title}}</text>
									<view style="display: flex;flex-direction: column;font-size: 28rpx;color: #999;">
										<u-row>
											<i class="mgc_quill_pen_line"></i>
											<text style="margin-left: 10rpx;">{{item.authorInfo.screenName}}</text>
										</u-row>
										<u-row>
											<u-row align="baseline">
												<i class="mgc_play_circle_line"></i>
												<text style="margin-left: 10rpx;">{{item.views}}</text>
											</u-row>
											<u-row align="baseline" style="margin-left: 40rpx;">
												<i class="mgc_chat_4_line"></i>
												<text style="margin-left: 10rpx;">{{item.commentsNum}}</text>
											</u-row>
										</u-row>
									</view>
								</view>
							</u-row>
						</block>
					</view>

				</scroll-view>
			</swiper-item>
			<swiper-item>
				<z-paging @query="getComments" v-model="comments" ref="comments" empty-view-text="还没有人发表评论哦,快来评论一下吧~">
					<view v-if="comments.length" style="padding: 30rpx;">
						<block v-for="(item,index) in comments" :key="index">
							<comment :data="item" @reply="pid = $event.id;showComment =true" :article="article"
								style="padding: 10rpx 0;">
							</comment>
						</block>
					</view>
					<template #bottom>
						<view style="padding: 15rpx 30rpx;border-top: #f7f7f7 1rpx solid;" class="bottom-tabbar"
							@click="showComment = true">
							<u-row class="u-info comment-box" @click="showComment = true">
								<u-icon name="edit-pen" size="20"></u-icon>
								<text style="margin-left:10rpx;font-size: 28rpx;">我简单喵两句</text>
							</u-row>
						</view>
					</template>

				</z-paging>
			</swiper-item>
		</swiper>
		<u-popup :show="showComment" @close="showComment = false;pid = 0" round="20" :z-index="10074"
			:customStyle="{transform: `translateY(${-keyboardHeight+'px'})`,transition:'transform 0.2s ease',padding:30+'rpx'}">
			<view style="position: relative;">
				<editor id="editor" :adjust-position="false" :show-img-size="false" :show-img-resize="false"
					:show-img-toolbar="false" @ready="onEditorReady" placeholder="简单喵两句"
					:class="{'fullscreen':fullscreenEdit}">
				</editor>
				<i :class="fullscreenEdit?'mgc_fullscreen_exit_2_line':'mgc_fullscreen_2_line'"
					style="position: absolute;top: 10rpx;right: 10rpx;" @click="fullscreenEdit= !fullscreenEdit"></i>
			</view>
			<u-row customStyle="margin-top:20rpx" justify="space-between">
				<u-col span="4">
					<u-row justify="space-between">
						<block v-for="(item,index) in cBtn" :key="index">
							<i class="ess" :class="item.icon" style="font-size: 44rpx;" @click="cBtnTap(item.name)"></i>
						</block>
					</u-row>
				</u-col>
				<view>
					<u-button shape="circle" color="#ff0800" customStyle="padding:4rpx,6rpx;height:50rpx;"
						@click="$u.throttle(reply(),2000,true) ">
						<i class="ess mgc_send_line" style="font-size: 40rpx;"></i>
						<text>发送</text>
					</u-button>
				</view>
			</u-row>
			<uv-scroll-list :indicator="false" v-if="images.length" style="margin-top: 20rpx;">
				<view v-for="(item, index) in images" :key="index"
					style="position: relative; display: inline-block;height: 100rpx;width: 100rpx;margin-right: 10rpx;">
					<image :src="item" mode="aspectFill" style="height: 100rpx; width: 100rpx; border-radius: 20rpx;"
						@click="preview(images,index)">
					</image>
					<u-icon name="close-circle" style="position: absolute; top: 0; right: 0;"
						@click="images.splice(index, 1)">
					</u-icon>
				</view>
			</uv-scroll-list>
			<!-- 隐藏面板 -->
			<block v-if="showComemntBtn == '表情'">
				<!-- 这里加表情 -->
				<block v-for="(one,oneIndex) in emojiData" :key="oneIndex">
					<swiper style="height: 120px;" v-show="emojiIndex == oneIndex">
						<swiper-item v-for="(two,twoIndex) in one.list" :key="twoIndex">
							<u-row justify="space-between" customStyle="flex-wrap:wrap">
								<image :src="one.base+one.slug+'_'+three+'.'+one.format" v-for="(three,key) in two"
									:key="key" mode="aspectFill" style="width: 100rpx;height: 100rpx;margin: 10rpx;"
									@click="insertEmoji(one.base,one.name,one.slug,three,one.format,key)"></image>
							</u-row>
						</swiper-item>
					</swiper>
				</block>
				<u-tabs :list="emojiData" :current="emojiIndex" lineHeight="3" lineColor="#ff0800"
					itemStyle="height: 26px;"
					:activeStyle="{color: '#303133',fontWeight: 'bold',transform: 'scale(1.05)'}"
					:inactiveStyle="{color: '#606266',transform: 'scale(1)'}" @change="emojiIndex = $event.index"
					style="position: static;"></u-tabs>
			</block>
			<block v-if="showComemntBtn=='颜色'">
				<u-row justify="space-between" style="margin-top: 30rpx;">
					<u-col :span="6">
						<u-row justify="space-between">
							<block v-for="(color,index) in colors" :key="index">
								<text :style="{background:color}" style="padding: 15rpx;border-radius: 50rpx;"
									@tap.stop="colorTap(color)"></text>
							</block>
						</u-row>
					</u-col>
					<i class="ess mgc_eraser_line" style="font-size: 40rpx;" @tap.stop="editorCtx.removeFormat()"></i>
				</u-row>
			</block>
		</u-popup>
	</z-paging-swiper>
</template>

<script>
	import comment from '@/pages/article/components/comments/comment.vue';
	export default {
		components: {
			comment
		},
		data() {
			return {
				swiperIndex: 0,
				articleList: [],
				comments: [],
				showComment: false,
				pid: 0,
				id: 0,
				article: {},
				video: {},
				list: ['简介', '评论'],
				showInfo: false,
				page: 1,
				commentPage: 1,
				limit: 15,
				showComemntBtn: false,
				images: [],
				cBtn: [{
						name: '表情',
						icon: 'mgc_emoji_line',
					}, {
						name: '图片',
						icon: 'mgc_pic_line',
					},
					{
						name: '颜色',
						icon: 'mgc_palette_line'
					}
				],
				fullscreenEdit: false,
				keyboardHeight: 0,
				editorCtx: null,
				emojiData: [],
				emojiIndex: 0,
				colors: ['#ff0800', '#5BD784', '#FFA600', '#0DD0F2', '#FB4F14', '#000000E6'],
				isReply: false,
				commentText: '',
			}
		},
		async onLoad(params) {
			this.formatEmoji()
			this.id = this.$Route.query.id;
			this.getData(this.id)
			this.getArticleList()
			this.getComments()
			uni.onKeyboardHeightChange(data => {
				this.keyboardHeight = data.height
			})
		},
		onPageScroll(e) {
			console.log(e)
		},
		methods: {
			getData(id) {
				this.$http.get('/article/info', {
					params: {
						id: id ? id : this.id
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.article = res.data.data
						this.video = this.article.videos[0]
					}
				})
			},
			getArticleList(bottom) {
				if (bottom) this.page += 1;
				this.$http.get('/article/articleList', {
					params: {
						page: this.page,
						limit: this.limit,
						params: {
							type: 'video'
						},
						random: 1
					}
				}).then(res => {
					if (res.data.code == 200) {
						if (!bottom) this.articleList = [];
						this.articleList = this.articleList.concat(res.data.data.data)
					}
				})
			},
			getComments(page, limit) {
				this.$http.get('/comments/list', {
					params: {
						page,
						limit,
						id: this.id
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.$refs.comments.complete(res.data.data.data)
					}
				})
			},
			tabsChange(index) {
				this.swiperIndex = index;
			},
			//swiper滑动中
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.swiperIndex = e.detail.current;
				this.$refs.tabs.unlockDx();
			},
			handleTouchStart(event) {
				this.startY = event.touches[0].clientY; // 记录触摸起始位置
				this.deltaY = 0; // 每次触摸开始时重置滑动距离
			},
			handleTouchMove(event) {
				let currentY = event.touches[0].clientY;
				this.deltaY = currentY - this.startY; // 计算Y轴滑动距离
			},
			onEditorReady() {
				// #ifdef MP-BAIDU
				this.editorCtx = requireDynamicLib('editorLib').createEditorContext('editor');
				// #endif

				// #ifdef APP-PLUS || H5 ||MP-WEIXIN
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
				}).exec()
				// #endif
			},
			formatEmoji() {
				// 处理后的数据
				let result = [];

				// 每页表情对象的数量
				const pageSize = 10;

				// 遍历原始数据中的每个 item
				this.$emoji.data.forEach(item => {
					// 构建一个新的 item 对象
					let newItem = {
						"name": item.name,
						"slug": item.slug,
						"base": item.base,
						"format": item.format,
						"list": []
					};
					// 遍历原始数据中的每个子列表
					let page = 1;
					let pageList = {}; // 用于存储每一页的表情对象
					Object.entries(item.list).forEach(([key, value]) => {
						// 将表情对象添加到当前页的列表中
						pageList[key] = value;

						// 如果达到一页的数量，将当前页列表添加到 newItem 的 list 中，重置页码和列表
						if (Object.keys(pageList).length === pageSize) {
							newItem.list.push(pageList);
							page++;
							pageList = {};
						}
					});

					// 添加最后一页的表情对象，如果不为空的话
					if (Object.keys(pageList).length > 0) {
						newItem.list.push(pageList);
					}

					// 将新的 item 添加到结果数组中
					result.push(newItem);
				});

				this.emojiData = result;

			},
			cBtnTap(name) {
				let permission = false
				let userInfo = this.$store.state.userInfo
				if (userInfo.group == 'administrator' || userInfo.group == 'editor' || userInfo.isVip) {
					permission = true
				}
				if (name == '图片') {
					this.chooseImage()
					return;
				}
				if (name == '颜色' && !permission) {
					uni.$u.toast('颜色评论仅会员可用');
					return
				}
				if (name == this.showComemntBtn) this.showComemntBtn = null;
				else this.showComemntBtn = name
			},
			colorTap(color) {
				this.editorCtx.format('color', color)
			},
			insertEmoji(base, name, slug, emoji, format, key) {
				this.editorCtx.insertImage({
					src: base + slug + '_' + emoji + '.' + format,
					alt: name + '_' + key + '_' + 'emoji',
					width: '30px',
					height: '30px',
					data: {
						name: name,
						emoji: emoji,
						format: format
					},
					success: res => {}
				})
			},
			reply() {
				if (this.isReply) return;
				this.editorCtx.getContents({
					success: (res) => {
						this.commentText = res.html.replace(/<img\s+[^>]*alt="([^"]+)_emoji"[^>]*>/g,
							function(match, alt) {
								return `[${alt}]`;
							});
						if (res.text.length < 2) {
							uni.$u.toast('再多说点吧~')
							return;
						};

						let params = {
							id: this.article.cid,
							parent: this.pid ? this.pid : 0,
							all: this.pid ? this.pid : 0,
							text: this.commentText,
							images: JSON.stringify(this.images)
						}
						this.isReply = true
						this.$http.post('/comments/add', {
							...params
						}).then(res => {
							if (res.data.code == 200) {
								this.commentText = '';
								this.showComment = false;
								this.images = [];
							}
							uni.$u.toast(res.data.msg);
							this.isReply = false
						}).catch(err => {
							this.isReply = false
						})
					}
				})

			},
			scrolltolower(type) {
				if (type == 'article') this.getArticleList(true);
				if (type == 'comment') this.getComments(true);
			},
			refresherpulling() {
				this.getComments(false)
			},
			goArticle(data) {
				if (this.article.cid == data.cid) return;
				let path
				switch (data.type) {
					case 'photo':
						path = '/pages/article/photo';
						break;
					case 'video':
						path = '/pages/article/video';
						break;
					default:
						path = '/pages/article/article';
						break;
				}
				this.$Router.push({
					path: path,
					query: {
						id: data.cid
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	@media(prefers-color-scheme:dark) {
		.text {
			color: white;
		}
	}

	.ql-container ::v-deep .ql-blank::before {
		min-height: 60rpx;
		height: 60rpx;
		font-style: normal;
	}

	#editor {
		background: #f9f9f9;
		height: auto;
		min-height: 120rpx;
		max-height: 200rpx;
		border-radius: 20rpx;
		padding: 8rpx 16rpx;
		transition: all 0.5s ease;
		/* 添加过渡效果 */
	}

	#editor.fullscreen {
		min-height: 600rpx;
		max-height: 600rpx;
	}

	.info-panel {
		display: grid;
		grid-template-rows: 0fr;
		overflow: hidden;
		transition: all 0.3s ease;

		&-active {
			transition: all 0.3s ease;
			grid-template-rows: 1fr;
		}
	}

	.info-panel .chlid {
		min-height: 0;
	}

	.icon {
		transition: all 0.3s ease;

		&-active {
			transform: rotate(90deg);
		}
	}

	.text {
		font-size: 28rpx;
		color: #999;
	}

	.swiper {
		height: 100%;
	}

	.comment {
		&-mask {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			background-color: rgba(0, 0, 0, 0.5);
		}

		&-order {
			font-size: 30rpx;
			color: #ff0800;
			display: flex;
			flex-direction: column;
			position: absolute;
			top: 100rpx;
			left: 30rpx;
			background-color: #fff;
			padding: 10rpx;
			border-radius: 20rpx;
			box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
		}

		&-box {
			padding: 14rpx 14rpx;
			border-radius: 50rpx;
			background: #f9f9f9;
		}
	}
</style>