<template>
	<z-paging-swiper>
		<swiper style="height: 100%;" :current="swiperIndex" @animationfinish="animationfinish">
			<swiper-item v-show="!loading">
				<z-paging ref="comments" v-model="comments" @query="getComments" :auto-scroll-to-top-when-reload="false"
					:auto-clean-list-when-reload="false">
					<template #top>
						<u-navbar placeholder autoBack @rightClick="showMore = true" fixed style="z-index: 10;">
							<view slot="right">
								<u-icon name="more-dot-fill"></u-icon>
							</view>
						</u-navbar>
					</template>
					<view style="margin: 10rpx 30rpx 30rpx 30rpx;" v-if="article" @touchend="touchEnd"
						@touchmove="touchMove">
						<articleHeader :data="article"></articleHeader>
						<articleContent :data="article" :autoPreview="isScroll"></articleContent>
						<articleFooter :data="article"></articleFooter>
					</view>
					<!-- 评论区 -->
					<u-gap height="8" bgColor="#85a3ff0a"></u-gap>
					<!-- #ifdef APP -->
					<u-sticky bgColor="#fff">
						<view style="position: relative;top: 0;padding: 30rpx 30rpx 0 30rpx;">
							<u-row>
								<view @click="showOrderList = !showOrderList"
									style="display: flex; align-items: center;">
									<text style="margin-right: 10rpx;">{{orderName}}</text>
									<u-icon :name="showOrderList?'arrow-up-fill':'arrow-down-fill'" size="10"
										color="#999"></u-icon>
								</view>
							</u-row>
							<u-transition :show="showOrderList"
								style="position: absolute; top: -10rpx; left: 0; width: 100%;z-index: 1001;">
								<view>
									<!-- 半透明遮罩 -->
									<view @click.stop="showOrderList = false"
										style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.5);">
									</view>
									<view
										style="font-size: 30rpx;color:#a899e6;display: flex;flex-direction: column;position: absolute; top: 100rpx; left: 30rpx; background-color: #fff; padding: 10rpx; border-radius: 20rpx; box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);">
										<block v-for="(item,index) in orderList" :key="index">
											<text @click.stop="orderTap(item.name)"
												style="padding: 15rpx;">{{item.name}}</text>
										</block>
									</view>
								</view>
							</u-transition>
						</view>
					</u-sticky>
					<!-- #endif -->
					<!-- #ifndef APP -->
					<u-sticky bgColor="#fff" offsetTop="-44">
						<view style="position: relative;top: 0;padding: 30rpx 30rpx 0 30rpx;">
							<u-row>
								<view @click="showOrderList = !showOrderList"
									style="display: flex; align-items: center;">
									<text style="margin-right: 10rpx;">{{orderName}}</text>
									<u-icon :name="showOrderList?'arrow-up-fill':'arrow-down-fill'" size="10"
										color="#999"></u-icon>
								</view>
							</u-row>
							<u-transition :show="showOrderList"
								style="position: absolute; top: -10rpx; left: 0; width: 100%;z-index: 1001;">
								<view>
									<!-- 半透明遮罩 -->
									<view @click.stop="showOrderList = false"
										style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.5);">
									</view>
									<view
										style="font-size: 30rpx;color:#a899e6;display: flex;flex-direction: column;position: absolute; top: 100rpx; left: 30rpx; background-color: #fff; padding: 10rpx; border-radius: 20rpx; box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);">
										<block v-for="(item,index) in orderList" :key="index">
											<text @click.stop="orderTap(item.name)"
												style="padding: 15rpx;">{{item.name}}</text>
										</block>
									</view>
								</view>
							</u-transition>
						</view>

					</u-sticky>
					<!-- #endif -->
					<view style="margin: 30rpx;">
						<!-- 开始 -->
						<block v-for="(item,index) in comments" v-if="comments">
							<view style="margin:10rpx 0">
								<comment :data="item" @subComment="subComment = $event;showSub =true"
									@reply="pid = $event.coid;showComment =true" :article="article"></comment>
							</view>
						</block>
					</view>
					<template #bottom>
						<u-row customStyle="padding-top:10rpx;padding:20rpx" justify="space-between">
							<u-col span="6">
								<u-row customStyle="padding:14rpx 14rpx;border-radius: 50rpx;background:#85a3ff14"
									class="u-info" @click="showComment = true">
									<u-icon name="edit-pen" size="20"></u-icon>
									<text style="margin-left:10rpx;font-size: 28rpx;">说点什么</text>
								</u-row>
							</u-col>
							<u-col span="5">
								<u-row customStyle="margin-left:20rpx;flex:1" justify="space-around">
									<view style="display: flex; flex-direction: column;align-items: center;"
										@click="$refs.reward.open()">
										<u-icon name="rmb-circle" size="20"></u-icon>
										<u-text text="发电" size="12"></u-text>
									</view>
									<view style="display: flex; flex-direction: column;align-items: center;"
										@click="$u.throttle(btnTap('mark'),1000,true)">
										<u-icon :color="article && article.isMark?'#a899e6':''" name="star" size="22"
											:class="{'animate__animated animate__pulse':article && article.isMark}"></u-icon>
										<u-text text="收藏" size="12"></u-text>
									</view>

									<view style="display: flex; flex-direction: column;align-items: center;"
										@click="$u.throttle(btnTap('likes'),1000,true)">
										<u-icon :color="article && article.isLike?'#a899e6':''" name="thumb-up"
											size="22"
											:class="{'animate__animated animate__bounceIn':article && article.isLike}"></u-icon>
										<u-text text="点赞" size="12"></u-text>
									</view>
								</u-row>
							</u-col>
						</u-row>
					</template>
				</z-paging>
			</swiper-item>
			<swiper-item>
				<z-paging refresher-only ref="author">
					<template #top>
						<u-navbar :bgColor="`rgba(255,255,255,0)`" placeholder
							@leftClick="swiperIndex = 0;$u.toast(swiperIndex)" @rightClick="showMore = true" fixed>
							<view slot="right">
								<u-icon name="more-dot-fill"></u-icon>
							</view>
						</u-navbar>
					</template>
				</z-paging>
			</swiper-item>
		</swiper>
		<u-loading-page :loading="loading"></u-loading-page>
		<!-- 页面公用组件 -->
		<!-- 回复文章 -->
		<u-popup :show="showComment" @close="showComment = false;pid = 0" round="20"
			:customStyle="`padding:30rpx;padding-bottom:${keyboardHeight}px`">
			<u--textarea :adjustPosition="false" :cursorSpacing="40" type="textarea" v-model="commentText"
				placeholder="灵感迸发" border="none"
				customStyle="background:#85a3ff14;padding:4rpx 10rpx;border-radius:20rpx"></u--textarea>
			<u-row customStyle="margin-top:10rpx" justify="space-between">
				<u-col span="6">
					<u-row justify="space-between">
						<block v-for="(item,index) in cBtn" :key="index">
							<u-icon :name="item.icon" size="20" @click="cBtnTap(item.name)"></u-icon>
						</block>
					</u-row>
				</u-col>
				<view>
					<u-button shape="circle" color="#a899e6" customStyle="padding:4rpx,6rpx" size="mini" text="发送"
						@click="reply"></u-button>
				</view>
			</u-row>
			<!-- 隐藏面板 -->
			<block v-if="showComemntBtn == '表情'">
				<!-- 这里加表情 -->
				<!-- ui -->
				表情
			</block>
		</u-popup>
		<!-- 分享&&管理弹窗 -->
		<u-popup :show="showMore" @close="showMore = false" customStyle="padding:30rpx" round="20">
			<u-row justify="space-between" style="border-bottom:1px solid #f7f8f7;padding-bottom: 30rpx;">
				<u-col span="2" v-for="(item,index) in share" :key="index" align="center"
					customStyle="flex-direction:column" @click="shareTap">
					<view :style="{background:item.color,borderRadius:'50rpx',padding:'20rpx'}">
						<u-icon :name="item.icon" color="white" size="26"></u-icon>
					</view>
					<text style="margin-top:10rpx">{{item.name}}</text>
				</u-col>
			</u-row>
			<u-row customStyle="margin-top:30rpx">
				<u-col span="2" v-for="(item,manageIndex) in manage" :key="manageIndex" align="center"
					customStyle="flex-direction:column">
					<view :style="{borderRadius:'50rpx',padding:'20rpx'}" class="u-info-light-bg">
						<u-icon :name="item.icon" size="26"></u-icon>
					</view>
					<text style="margin-top:10rpx">{{item.name}}</text>
				</u-col>
			</u-row>
		</u-popup>
		<!-- 子评论 -->
		<u-popup :show="showSub" @close="showSub = false;keyboardHeight = 0" round="20">
			<u-gap height="25"></u-gap>
			<view>
				<subComment :data="subComment" ref="paging" :keyHeigt="keyboardHeight"></subComment>
			</view>
		</u-popup>
		<uv-modal :showConfirmButton="false" ref="reward" title="投喂/发电">
			<view style="flex:1;display: flex;flex-direction: column;">
				<u-row justify="space-between" customStyle="flex:1">
					<block v-for="(item,index) in rewardList" :key="index">
						<u-button size="normal" customStyle="width:100rpx;height:60rpx;margin:0"
							:plain="selectReward!=item" @click="selectReward = item" :text="item"
							color="#a899e6"></u-button>
					</block>
				</u-row>
				<view style="margin-top: 20rpx;border-bottom: 0.5px solid #a899e6;">
					<u-input type="number" border="none" v-model="reward" placeholder="自定义投喂数量"></u-input>
				</view>
				<view style="margin-top: 40rpx;">
					<u-button color="#a899e6" shape="circle" customStyle="width:120rpx;height:60rpx"
						@click="btnTap('reward',reward?reward:selectReward)">投喂</u-button>
				</view>
			</view>


			<view slot="confirmButton"></view>
		</uv-modal>
	</z-paging-swiper>
</template>

<script>
	import articleHeader from '@/pages/article/components/header.vue';
	import articleContent from '@/pages/article/components/content.vue';
	import articleFooter from '@/pages/article/components/footer.vue';
	import comment from '@/pages/article/components/comments/comment.vue';
	import subComment from '@/pages/article/components/comments/subComment.vue';
	import ZPMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin'
	export default {
		components: {
			articleHeader,
			articleContent,
			articleFooter,
			comment,
			subComment,
		},
		mixins: [ZPMixin],
		data() {
			return {
				showReward: false,
				showOrderList: false,
				orderName: '全部评论',
				isScroll: false,
				cid: 0,
				pid: 0,
				article: null,
				comments: [],
				author: null,
				subComment: null,
				loading: true,
				showMore: false,
				showComment: false,
				showComemntBtn: null,
				commentText: '',
				commentTabIndex: 0,
				swiperIndex: 0,
				commentId: 0,
				showSub: false,
				orderList: [{
						name: '全部评论',
					}, {
						name: '点赞最多'
					},
					{
						name: '最新'
					},
					{
						name: '最早'
					},
					{
						name: '只看楼主'
					}
				],
				cBtn: [{
					name: '表情',
					icon: 'heart',
				}],
				share: [{
						name: '微信',
						icon: 'weixin-fill',
						color: 'green'
					},
					{
						name: '微信',
						icon: 'weixin-fill',
						color: 'green'
					},
					{
						name: '微信',
						icon: 'weixin-fill',
						color: 'green'
					},
					{
						name: '微信',
						icon: 'weixin-fill',
						color: 'green'
					},
					{
						name: '微信',
						icon: 'weixin-fill',
						color: 'green'
					}
				],
				manage: [{
						name: '举报',
						icon: 'warning'
					},
					{
						name: '编辑',
						icon: 'warning'
					}
				],
				rewardList: [1, 2, 5, 10],
				reward: null,
				selectReward: 0,
				keyboardHeight: 0,
			};
		},
		onLoad(params) {
			// GetStorage 获取存储本地的文章简略信息
			this.cid = params.id
			this.author = uni.getStorageSync(`article_${params.id}`)
			this.getData(params.id)
			setTimeout(() => {
				this.loading = false
			}, 700)
		},
		beforeRouteLeave(to, from, next) {
			if (this.showComment || this.showMore || this.showSub || this.swiperIndex) {
				this.showComment = false;
				this.showSub = false;
				this.showMore = false;
				this.swiperIndex = 0;
				next(false)
				this.$Router.$lockStatus = false
			} else {
				next();
			}

		},
		created() {
			uni.onKeyboardHeightChange(data => {
				console.log(data)
				this.keyboardHeight = data.height
			})
		},
		methods: {
			shareTap(index) {
				console.log(index)
			},
			getData(id) {
				this.$http.get('/typechoContents/contentsInfo', {
					params: {
						key: id,
						isMd: 1,
						uid: this.$store.state.hasLogin ? this.$store.state.userInfo.uid : '',
					}
				}).then(res => {
					console.log(res)
					if (res.statusCode == 200) {
						this.article = res.data
						this.article.text = this.replaceEmoji(res.data.text)
					}
				})
			},
			cBtnTap(name) {
				if (name == this.showComemntBtn) this.showComemntBtn = null;
				else this.showComemntBtn = name
				console.log(name)
			},
			getComments(page, limit) {
				this.$http.get('/typechoComments/commentsList', {
					params: {
						page,
						limit,
						searchParams: JSON.stringify({
							type: 'comment',
							cid: this.cid,
							parent: 0,
						})
					}
				}).then(res => {
					console.log(res)
					if (res.statusCode == 200) {
						this.$refs.comments.complete(res.data.data)
					}
				})
			},
			reply() {
				if (this.commentText.length < 3) {
					uni.$u.toast('再多说点吧~')
					return;
				};
				let params = JSON.stringify(params = {
					cid: this.cid,
					ownerId: this.article.authorId,
					parent: this.pid ? this.pid : 0,
					allParent: this.pid ? this.pid : 0,
					text: this.commentText
				})
				this.$http.post('/typechoComments/commentsAdd', {
					params
				}).then(res => {
					if (res.data.code) {
						uni.$u.toast('已发送~')
						this.commentText = null
						this.showComment = false
						this.$refs.comments.reload()
					} else {
						uni.$u.toast(res.data.msg)
					}
				})
			},
			replaceEmoji(html) {
				return html.replace(
					/<img[^>]*?alt="src=([^"]+)\|poster=([^"]+)\|type=video"[^>]*?>/g, (match, src, poster) => {
						return `<video src="${src}" poster="${poster}" muted width="100%" style="border-radius:20rpx" />`
					}).replace(/_|#([^|]+)_(([^|]+))|/g, (match, name, key) => {
					const emoji = this.$emoji.data.find(e => e.name === name)
					if (emoji) {
						const src = `${emoji.base}${emoji.slug}_${emoji.list[key]}.${emoji.format}`
						return `<img src="${src}" style="width:100rpx;height:100rpx">`
					}
					// 如果没有找到,直接返回空字符串
					// 即删除整个匹配文本
					return ''
				}).replace(/\|</g, '<').replace(/>\|/g, '>')

			},
			btnTap(type, num) {

				this.$http.post('/typechoUserlog/addLog', {
					params: JSON.stringify({
						type,
						cid: this.article.cid,
						num,
					})
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						uni.$u.toast(type == 'likes' ? '点赞' + res.data.msg : res.data.msg)
						switch (type) {
							case 'likes':
								this.article.isLike = !this.article.isLike
								break;
							case 'mark':
								this.article.isMark = !this.article.isMark
								break;
							default:
								break;
						}
					} else {
						uni.$u.toast(res.data.msg)
					}
				})
			},
			changTab(data) {
				console.log(data)
				this.commentTabIndex = data.index

			},
			animationfinish(data) {
				this.swiperIndex = data.detail.current
			},
			touchEnd() {
				// 停止移动
				this.isScroll = false;
			},
			touchMove(e) {
				// 手指触摸后的移动事件
				this.isScroll = true;
			},
			orderTap(item) {
				this.orderName = item
				this.showOrderList = false
			}

		}
	}
</script>

<style lang="scss">

</style>