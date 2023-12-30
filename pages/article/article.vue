<template>
	<z-paging-swiper>
		<z-paging ref="comments" v-model="comments" @query="getComments" :auto-scroll-to-top-when-reload="false"
			:auto-clean-list-when-reload="false" v-show="!loading" @scroll="onScroll" @onRefresh="onRefresh"
			cache-mode="always" use-cache :cache-key="`article_mid-${cid}`">
			<template #top>
				<u-navbar placeholder fixed style="z-index: 10;">
					<view slot="left" style="display:flex;align-items: center;">
						<i class="ess icon-left_line" style="font-size: 60rpx;" @click="$Router.back(1)"></i>
						<view style="margin-left: 40rpx;display: flex;align-items: center;"
							@click="goProfile(article.authorId)" v-show="showNavAvatar">
							<u-avatar :src="article && article.authorInfo && article.authorInfo.avatar" size="28"
								customStyle="border:4rpx solid #85a3ff32"></u-avatar>
							<text
								style="font-weight: 600;font-size: 30rpx;margin-left: 20rpx;">{{article && article.authorInfo && article.authorInfo.name}}</text>
						</view>
					</view>
					<view slot="right">
						<view v-show="showNavAvatar"
							style="display: flex; align-items: center;border-radius: 50rpx;border:2rpx solid #85a3ff32;padding: 0rpx 16rpx;line-height: 1;">
							<u-row customStyle="margin-right:20rpx;" @click="follow(article.authorId)">
								<i class="ess icon-add_line" style="font-size: 30rpx;font-weight: 600;"
									:style="{color:article && article.authorInfo &&article.authorInfo.isfollow?'':'#85a3ff'}"
									v-if="article && article.authorInfo &&!article.authorInfo.isfollow"></i>

								<text style="font-size: 26rpx;margin-left: 10rpx;padding-right:20rpx;font-weight: 600;"
									:style="{color:article && article.authorInfo && article.authorInfo.isfollow?'':'#85a3ff'}">{{article && article.authorInfo && article.authorInfo.isfollow?'已关注':'关注'}}</text>
							</u-row>
							<view>
								<i class="ess icon-more_1_line" style="font-size: 60rpx;" @click="showMore = true"></i>
							</view>
						</view>
						<i class="ess icon-more_1_line" style="font-size: 60rpx;" @click="showMore = true"
							v-show="!showNavAvatar"></i>
					</view>
				</u-navbar>
			</template>
			<view style="padding: 10rpx 30rpx 30rpx 30rpx;" v-if="article" @touchend="touchEnd" @touchmove="touchMove">
				<articleHeader :data="article" @follow="follow($event)"></articleHeader>
				<articleContent :data="article" :autoPreview="isScroll" @ready="loading = false" @hideTap="hideTap">
				</articleContent>
				<articleFooter :data="article"></articleFooter>
			</view>
			<!-- 评论区 -->
			<u-gap height="8" bgColor="#85a3ff0a"></u-gap>
			<!-- #ifdef APP -->
			<u-sticky bgColor="#fff">
				<view style="position: relative;top: 0;padding: 30rpx 30rpx 0 30rpx;" @touchmove.stop>
					<u-row>
						<view @click="showOrderList = !showOrderList" style="display: flex; align-items: center;">
							<text
								style="margin-right: 6rpx;font-size: 30rpx;color: #666;font-weight: 600;">{{orderName}}</text>
							<i class="ess" style="font-size: 50rpx;"
								:class="showOrderList?'icon-up_small_fill':'icon-down_small_fill'"></i>

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
								style="font-size: 30rpx;color:#85a3ff;display: flex;flex-direction: column;position: absolute; top: 100rpx; left: 30rpx; background-color: #fff; padding: 10rpx; border-radius: 20rpx; box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);">
								<block v-for="(item,index) in orderList" :key="index">
									<text @click.stop="orderTap(item.name);$refs.comments.reload()"
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
				<view style="position: relative;top: 0;padding: 30rpx 30rpx 0 30rpx;" @touchmove.stop>
					<u-row>
						<view @click="showOrderList = !showOrderList" style="display: flex; align-items: center;">
							<text
								style="margin-right: 6rpx;font-size: 30rpx;color: #666;font-weight: 600;">{{orderName}}</text>
							<i class="ess" style="font-size: 50rpx;"
								:class="showOrderList?'icon-up_small_fill':'icon-down_small_fill'"></i>
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
								style="font-size: 30rpx;color:#85a3ff;display: flex;flex-direction: column;position: absolute; top: 100rpx; left: 30rpx; background-color: #fff; padding: 10rpx; border-radius: 20rpx; box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);">
								<block v-for="(item,index) in orderList" :key="index">
									<text @click.stop="orderTap(item.name);$refs.comments.reload()"
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
				<u-row customStyle="padding:10rpx 20rpx;border-top:#85a3ff1e solid 1rpx" justify="space-between">
					<u-col span="6">
						<u-row customStyle="padding:14rpx 14rpx;border-radius: 50rpx;background: #85a3ff0a;"
							class="u-info" @click="showComment = true">
							<u-icon name="edit-pen" size="20"></u-icon>
							<text style="margin-left:10rpx;font-size: 28rpx;">说点什么</text>
						</u-row>
					</u-col>
					<u-col span="5">
						<u-row customStyle="margin-left:20rpx;flex:1" justify="space-around">
							<view style="display: flex; flex-direction: column;align-items: center;"
								@click="$refs.reward.open()">
								<i class="ess icon-copper_coin_line" style="font-size: 44rpx;"></i>
								<u-text text="发电" size="12"></u-text>
							</view>
							<view style="display: flex; flex-direction: column;align-items: center;"
								@click="$u.throttle(btnTap('mark'),1000,true)">
								<i class="ess icon-star_line" style="font-size: 44rpx;"
									:style="{color:article && article.isMark?'#85a3ff':''}"
									:class="{'animate__animated animate__pulse':article && article.isMark}"></i>

								<u-text text="收藏" size="12"></u-text>
							</view>

							<view style="display: flex; flex-direction: column;align-items: center;"
								@click="$u.throttle(btnTap('likes'),1000,true)">
								<i class="ess icon-thumb_up_2_line" style="font-size: 44rpx;"
									:style="{color:article && article.isLike?'#85a3ff':''}"
									:class="{'animate__animated animate__pulse':article && article.isLike}"></i>
								<u-text text="点赞" size="12"></u-text>
							</view>
						</u-row>
					</u-col>
				</u-row>
			</template>
		</z-paging>
		<u-loading-page :loading="loading"></u-loading-page>
		<!-- 页面公用组件 -->
		<!-- 回复文章 -->
		<u-popup :show="showComment" @close="showComment = false;pid = 0" round="20" :z-index="10074"
			:customStyle="{transform: `translateY(${-keyboardHeight+'px'})`,transition:'transform 0.3s ease',padding:30+'rpx'}">
			<editor id="editor" :adjust-position="false" :show-img-size="false" :show-img-resize="false"
				:show-img-toolbar="false" @ready="onEditorReady" placeholder="说点什么"
				style="background: #85a3ff0a;height: auto;min-height: 60px;max-height: 100px;border-radius: 20rpx;padding: 8rpx 16rpx;">
			</editor>
			<u-row customStyle="margin-top:20rpx" justify="space-between">
				<u-col span="2">
					<u-row justify="space-between">
						<block v-for="(item,index) in cBtn" :key="index">
							<i class="ess" :class="item.icon" style="font-size: 44rpx;" @click="cBtnTap(item.name)"></i>
						</block>
					</u-row>
				</u-col>
				<view>
					<u-button shape="circle" color="#85a3ff" customStyle="padding:4rpx,6rpx;height:50rpx;width:120rpx"
						text="发送" @click="$u.throttle(reply(),2000,true) "></u-button>
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
				<u-tabs :list="emojiData" :current="emojiIndex" lineHeight="3" lineColor="#85a3ff"
					itemStyle="height: 24px;"
					:activeStyle="{color: '#303133',fontWeight: 'bold',transform: 'scale(1.05)'}"
					:inactiveStyle="{color: '#606266',transform: 'scale(1)'}" @change="emojiIndex = $event.index"
					style="position: static;"></u-tabs>
			</block>
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
							color="#85a3ff"></u-button>
					</block>
				</u-row>
				<view style="margin-top: 20rpx;border-bottom: 0.5px solid #85a3ff;">
					<u-input type="number" border="none" v-model="reward" placeholder="自定义投喂数量"></u-input>
				</view>
				<view style="margin-top: 40rpx;">
					<u-button color="#85a3ff" shape="circle" customStyle="width:120rpx;height:60rpx"
						@click="btnTap('reward',reward?reward:selectReward)">投喂</u-button>
				</view>
			</view>
			<view slot="confirmButton"></view>
		</uv-modal>

		<!-- 分享 -->
		<u-popup mode="bottom" round="10" :show="showMore" @close="showMore =false" :closeable="true">

			<view style="padding: 30rpx;">
				<view style="text-align: center;color: #999;">
					<text>分享至</text>
				</view>
				<view style="margin-top: 50rpx;">
					<u-row customStyle="border-bottom:1rpx solid #85a3ff0a;padding-bottom:30rpx" justify="space-around">
						<block v-for="(item,index) in share" :key="index">
							<u-row align="center" customStyle="flex-direction:column"
								@click="shareTap(item.provider,item.type,item.scene,article.title,filterHtml(article.text),'https://baidu.com',article.images[0])">
								<view style="padding: 20rpx;border-radius: 100rpx;" :style="{background:item.color}">
									<u-icon :name="item.icon" color="white" size="24"></u-icon>
								</view>
								<text style="margin-top: 20rpx;">{{item.name}}</text>
							</u-row>
						</block>
					</u-row>
					<view style="display: flex;flex-direction: column;margin-top: 50rpx;">
						<u-row customStyle="margin-bottom:30rpx">
							<i class="ess icon-alert_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">举报</text>
						</u-row>
						<u-row customStyle="margin-bottom: 30rpx;">
							<i class="ess icon-flash_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">复制链接</text>
						</u-row>
						<u-row customStyle="margin-bottom: 30rpx;">
							<i class="ess icon-share_forward_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">通过系统分享</text>
						</u-row>
						<view
							v-if="article&& article.authorId == $store.state.userInfo.uid|| $store.state.userInfo.groupKey =='administrator'">
							<u-row customStyle="margin-bottom: 30rpx;" @click="goEdit()">
								<i class="ess icon-edit_line" style="font-size: 40rpx;"></i>
								<text style="margin-left:20rpx">编辑</text>
							</u-row>
							<u-row customStyle="margin-bottom: 30rpx;color:red" @click="showDelete = true">
								<i class="ess icon-delete_2_line" style="font-size: 40rpx;"></i>
								<text style="margin-left:20rpx">删除</text>
							</u-row>

						</view>

					</view>
				</view>
			</view>
			<u-popup :show="showDelete" :round="10" mode="center" @close="showDelete = false" customStyle="width:500rpx">
				<view
					style="display: flex;flex-direction: column;align-items: center;justify-content: center;padding: 50rpx;">
					<text style="font-size: 34rpx;">提示</text>
					<view style="margin-top:30rpx">
						<text>是否确定删除？</text>
					</view>
					<u-row customStyle="margin-top: 60rpx;flex:1;width:100%" justify="space-between">
						<u-button plain color="#85a3ff" customStyle="height:60rpx;margin-right:10rpx" shape="circle"
							@click="showDelete = false">取消</u-button>
						<u-button color="#85a3ff" customStyle="height:60rpx;margin-left:10rpx" shape="circle"
							@click="deleteArticle()">确定</u-button>
					</u-row>
				</view>
			</u-popup>
		</u-popup>
		<!-- 上传进度 -->
		<uv-modal :show="showLoading" ref="upload" :zIndex="10076"
			@close="showLoading=false;uploadErr.status = false;uploadErr.msg=null;"
			:closeOnClickOverlay="uploadErr.status" :showConfirmButton="false"
			:title="uploadErr.status?'上传错误':'上传中...'">
			<u-line-progress :percentage="percentage" activeColor="#85a3ff" :showText="false"
				v-if="!uploadErr.status"></u-line-progress>
			<text v-if="uploadErr.status">错误信息：{{uploadErr.msg}}</text>
			<view slot="confirmButton"></view>
		</uv-modal>
		<u-popup :show="showPay" :round="10" mode="center" @close="showPay = false" customStyle="width:500rpx">
			<view
				style="display: flex;flex-direction: column;align-items: center;justify-content: center;padding: 50rpx;">
				<text style="font-size: 34rpx;">提示</text>
				<view style="margin-top:30rpx">
					<text>是否确定查看？</text>
				</view>
				<u-row customStyle="margin-top: 60rpx;flex:1;width:100%" justify="space-between">
					<u-button plain color="#85a3ff" customStyle="height:60rpx;margin-right:10rpx" shape="circle"
						@click="showPay = false">取消</u-button>
					<u-button color="#85a3ff" customStyle="height:60rpx;margin-left:10rpx" shape="circle"
						@click="buyHide()">确定</u-button>
				</u-row>
			</view>
		</u-popup>
		
	</z-paging-swiper>
</template>

<script>
	import {
		shareTap
	} from '@/common/common.js';
	import {
		filterHtml
	} from '@/common/common.js';
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
				showDelete: false,
				isReply: false,
				editorCtx: null,
				percentage: 30,
				showLoading: false,
				uploadErr: {
					status: false,
					msg: ''
				},
				images: [],
				showPay: false,
				showReward: false,
				showOrderList: false,
				showNavAvatar: false,
				orderName: '全部评论',
				isScroll: false,
				cid: 0,
				pid: 0,
				article: null,
				comments: [],
				emojiData: [],
				emojiIndex: 0,
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
						order: ''
					}, {
						name: '点赞最多',
						order: 'likes'
					},
					{
						name: '最新',
						order: 'created desc'
					},
					{
						name: '最早',
						order: 'created asc'
					},
					{
						name: '只看楼主',
						order: 'author'
					}
				],
				cBtn: [{
					name: '表情',
					icon: 'icon-emoji_line',
				}, {
					name: '图片',
					icon: 'icon-pic_line',
				}],
				share: [{
						name: '微信',
						icon: 'weixin-fill',
						provider: 'weixin',
						type: 0,
						scene: 'WXSceneSession',
						color: '#46d262'
					},
					{
						name: '朋友圈',
						icon: 'moments',
						provider: 'weixin',
						type: 0,
						scene: 'WXSceneTimeline',
						color: '#46d262'
					},
					{
						name: 'QQ',
						icon: 'qq-fill',
						provider: 'qq',
						type: 2,
						scene: '',
						color: '#0070ff'
					},
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
				headerHeight: 0,
			};
		},
		onLoad(params) {
			// GetStorage 获取存储本地的文章简略信息
			this.cid = params.id
			this.author = uni.getStorageSync(`article_${params.id}`)
			this.getData(params.id)

		},
		beforeRouteLeave(to, from, next) {
			if (this.showComment || this.showMore || this.showSub) {
				this.showComment = false;
				this.showSub = false;
				this.showMore = false;
				this.$Router.$lockStatus = false
				return
			}
			next();

		},
		created() {
			this.formatEmoji()
		},
		onShow() {
			uni.onKeyboardHeightChange(data => {
				console.log(data)
				this.keyboardHeight = data.height
			})
		},
		onUnload() {
			// 取消监听
			uni.offKeyboardHeightChange(data => {

			})
		},
		methods: {
			shareTap,
			filterHtml,
			getData(id) {
				this.$http.get('/article/info', {
					params: {
						key: id ? id : this.cid,
						isMd: 0,
						uid: this.$store.state.hasLogin ? this.$store.state.userInfo.uid : '',
						token: uni.getStorageSync('token')
					}
				}).then(res => {
					console.log(res)
					if (res.statusCode == 200) {
						this.article = res.data
						this.article.text = res.data && this.replaceEmoji(res.data.text)
					}
				})
			},
			cBtnTap(name) {
				if (name == '图片') {
					this.chooseImage()
					return;
				}
				if (name == this.showComemntBtn) this.showComemntBtn = null;
				else this.showComemntBtn = name
				console.log(name)
			},
			async chooseImage() {
				if (this.images.length >= 6) {
					uni.$u.toast('至多可添加6张图片')
					return;
				}
				try {
					const res = await uni.chooseImage({
						count: 6
					});

					const imageList = res.tempFilePaths;
					this.$refs.upload.open()

					const uploadPromises = imageList.map(async (item) => {
						try {
							const uploadedImage = await this.upload(item);
							this.images.push(uploadedImage);
						} catch (error) {
							this.uploadErr.status = true
							this.uploadErr.msg = error.data.msg
							console.error("Upload failed:", error);
						}
					});

					await Promise.all(uploadPromises);

					this.$refs.upload.close()

				} catch (error) {
					this.$refs.upload.close()
					console.error("Choose image failed:", error);
				}
			},
			async upload(filePath) {
				return new Promise((resolve, reject) => {
					this.$http.upload('/upload/full', {
						filePath,
						name: 'file'
					}).then(res => {
						if (res.data.code) {
							resolve(res.data.data.url)
						} else {
							reject(res)
						}
					})
				});
			},
			onRefresh() {
				this.getData()
			},
			getComments(page, limit) {
				let order = this.orderList.find(order => order.name == this.orderName)
				let params = {
					page,
					limit,
					searchParams: JSON.stringify({
						type: 'comment',
						cid: this.cid,
						parent: 0,
						authorId: order.name == '只看楼主' ? this.article.authorId : null
					}),
					order: order.order
				}

				if (order.name == '只看楼主') {
					params.order = null
				}
				this.$http.get('/comments/commentsList', {
					params
				}).then(res => {
					if (res.statusCode == 200) {
						this.$refs.comments.complete(res.data.data)
					}
				}).catch(err => {
					this.$refs.comments.complete(false)
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
						console.log(res.text, this.commentText.length)
						if (res.text.length < 2) {
							uni.$u.toast('再多说点吧~')
							return;
						};

						let params = JSON.stringify(params = {
							cid: this.cid,
							ownerId: this.article.authorId,
							parent: this.pid ? this.pid : 0,
							allParent: this.pid ? this.pid : 0,
							text: this.commentText,
							images: this.images
						})
						this.isReply = true
						this.$http.post('/comments/commentsAdd', {
							params
						}).then(res => {
							if (res.data.code) {
								uni.$u.toast('已发送~')
								this.commentText = null
								this.showComment = false
								this.images = []
								this.$refs.comments.reload()

							} else {
								uni.$u.toast(res.data.msg)
							}
							this.isReply = false
						}).catch(err => {
							this.isReply = false
						})
					}
				})

			},
			replaceEmoji(html) {
				if (html) {
					return html.replace(
						/<img[^>]*?alt="src=([^"]+)\|poster=([^"]+)\|type=video"[^>]*?>/g, (match, src, poster) => {
							return `<div style="border-radius:10px"><video src="${src}" poster="${poster}" object-fit muted width="100%" style="border-radius:10px" /></div>`
						}).replace(/_|#([^|]+)_(([^|]+))|/g, (match, name, key) => {
						const emoji = this.$emoji.data.find(e => e.name === name)
						if (emoji) {
							const src = `${emoji.base}${emoji.slug}_${emoji.list[key]}.${emoji.format}`
							return `<img src="${src}" style="width:100rpx;height:100rpx">`
						}
						// 如果没有找到,直接返回空字符串
						// 即删除整个匹配文本
						return ''
					}).replace(/\|</g, '<').replace(/>\|/g, '>').replace(/【(回复|付费)查看：([^】]+)】/g, (match, type,
						content) => {
						return `<a style="text-decoration:unset;color:#85a3ff;border:#85a3ff dashed 1px;border-radius:10px;text-align:center;margin:10px 0;display:flex;flex:1;padding:20px;justify-content:center" data-type="${type}">
						${type}内容，${type}后查看
						</a>`;
					})

				}

			},
			btnTap(type, num) {

				this.$http.post('/userlog/addLog', {
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
							case 'reward':
								uni.$u.toast('投喂' + res.data.msg)
								setTimeout(() => {
									this.$refs.reward.close()
								}, 500)
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
			},
			onScroll(data) {
				if (data.detail.scrollTop > 160) this.showNavAvatar = true;
				else this.showNavAvatar = false;
			},
			goProfile(id) {
				this.$Router.push({
					path: '/pages/profile/profile',
					query: {
						id
					}
				})
			},
			follow(id) {
				if (this.$store.state.userInfo.uid == id) {
					uni.$u.toast('不可以关注自己');
					return;
				};
				this.$http.post('/user/follow', {
					touid: id,
				}).then(res => {
					uni.$u.toast(res.data.msg)
					this.article.authorInfo.isfollow = !this.article.authorInfo.isfollow
				})
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

			goEdit() {
				this.showMore = false
				if (this.article.type == 'post') {
					setTimeout(() => {
						this.$Router.push({
							path: '/publish/article/article',
							query: {
								update: 1,
								id: this.article.cid
							}
						})
					}, 500)
				}

			},
			preview(urls, current) {
				uni.previewImage({
					urls,
					current
				})
			},

			hideTap(type) {
				if (type == '付费') this.showPay = true
				else this.showComment = true;
			},
			buyHide() {
				this.$http.post('/article/buyHide', {
					cid: this.article.cid
				}).then(res => {
					if (res.data.code) {
						uni.$u.toast(res.data.msg)
						this.showPay = false
						setTimeout(() => {
							this.getData()
						}, 800)
					}
				})
			},
			deleteArticle(){
				this.$http.post('/article/articleDelete',{
					key:this.article.cid
				}).then(res=>{
					if(res.data.code){
						this.showDelete = false
						uni.$u.toast(res.data.msg)
						setTimeout(()=>{
							this.$Router.back()
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.ql-container ::v-deep .ql-blank::before {
		min-height: 60rpx;
		height: 60rpx;
		font-style: normal;
	}
</style>