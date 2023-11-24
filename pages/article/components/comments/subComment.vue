<template>
	<view>
		<z-paging ref="paging" @query="getComments" v-model="comments" :refresher-enabled="false">
			<template #top>
				<u-navbar autoBack placeholder></u-navbar>
			</template>

			<u-row align="top" customStyle="margin:30rpx;border-bottom: 1rpx #f7f7f7 solid;">

				<view style="position: relative;">
					<u-avatar :src="data.avatar" size="30" customStyle="border:4rpx solid #85a3ff32"
						@click="goProfile(data.authorId)"></u-avatar>
					<image class="avatar_head" mode="aspectFill"
						:src="data.opt&&data.opt.headStatus&&data.opt.head_picture">
					</image>
				</view>
				<view style="display: flex;flex:1; flex-direction: column;margin-left: 20rpx;padding-bottom: 30rpx;">
					<u-row>
						<text
							:style="{color:data.isvip?'#a899e6':'',fontSize:30+'rpx',fontWeight:600}">{{data.author}}</text>
						<text
							style="font-size: 18rpx;border:#98e6a8 solid 2rpx;color: #98e6a8;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx"
							v-if="data.authorId == data.ownerId">作者</text>
					</u-row>
					<view style="margin-top:10rpx;word-break: break-word;">
						<uv-parse :previewImg="false" selectable :showImgMenu="false"
							:content="formatEmoji(data.text)"></uv-parse>
					</view>
					<u-grid :col="3" :border="false" v-if="data.longtext && data.longtext.images">
						<u-grid-item v-for="(image,imageIndex) in data.longtext.images" :key="imageIndex"
							v-if="imageIndex<9" @click.native.stop="preview"
							:customStyle="{width:'210rpx',height:'210rpx',borderRadius:'20rpx',marginTop:'10rpx',marginRight:'10rpx'}">
							<image :src="image" mode="aspectFill" style="width:210rpx;height:210rpx;border-radius:10rpx"
								class="u-info-light-bg"></image>
						</u-grid-item>
					</u-grid>
					<u-row justify="space-between" customStyle="font-size: 24rpx;color: #aaa;">
						<text>{{$u.timeFormat(data.created,'mm-dd')}}</text>
						<u-row customStyle="flex-basis:25%" justify="space-between">
							<u-icon name="chat" color="#aaa" size="20" labelColor="#aaa" label-size="12"></u-icon>
							<u-icon name="thumb-up" color="#aaa" size="20" labelColor="#aaa" :label="1"
								label-size="12"></u-icon>
						</u-row>
					</u-row>
				</view>
			</u-row>

			<!-- 子评论开始 -->
			<view>
				<block v-for="(item,index) in comments" :key="index">
					<view style="padding:30rpx">
						<u-skeleton rows="2" avatar :loading="loading">
							<u-row align="top">
								<u-avatar :src="item.avatar" size="24" customStyle="border:4rpx solid #85a3ff32"
									@click="goProfile(item.authorId)"></u-avatar>

								<view style="display: flex;flex:1; flex-direction: column;margin-left: 20rpx;">
									<u-row>
										<text
											:style="{color:item.isvip?'#a899e6':'',fontSize:30+'rpx',fontWeight:600}">{{item.author}}</text>
										<text
											style="font-size: 18rpx;border:#98e6a8 solid 2rpx;color: #98e6a8;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx"
											v-if="item.authorId == data.ownerId">作者</text>
									</u-row>
									<view style="margin-top:10rpx;word-break: break-word;"
										@click="commentCheck(true,item.coid,item.author)">

										<uv-parse :previewImg="false" selectable :showImgMenu="false"
											:content="item.parent != data.coid&&item.authorId!=item.parentComments.authorId?formatEmoji(formatText(item)):formatEmoji(item.text)"></uv-parse>
									</view>
									<u-grid :col=" 3" :border="false" v-if="item.longtext && item.longtext.images">
										<u-grid-item v-for="(image,imageIndex) in item.longtext.images"
											:key="imageIndex" v-if="imageIndex<9" @click.native.stop="preview"
											:customStyle="{width:'210rpx',height:'210rpx',borderRadius:'20rpx',marginTop:'10rpx',marginRight:'10rpx'}">
											<image :src="image" mode="aspectFill"
												style="width:210rpx;height:210rpx;border-radius:10rpx"
												class="u-info-light-bg">
											</image>
										</u-grid-item>
									</u-grid>
									<u-gap height="6"></u-gap>
									<view>
										<u-row justify="space-between" customStyle="font-size: 24rpx;color: #aaa;">
											<text>{{$u.timeFormat(item.created,'mm-dd')}}</text>
											<u-row customStyle="flex-basis:30%" justify="space-between">
												<u-icon name="chat" color="#aaa" label="回复" size="20" labelColor="#aaa"
													label-size="12"></u-icon>
												<u-icon name="thumb-up" color="#aaa" :label="1" size="20"
													labelColor="#aaa" label-size="12"></u-icon>

											</u-row>
										</u-row>
									</view>
								</view>
							</u-row>
						</u-skeleton>
					</view>
				</block>
			</view>
			<template #bottom>
				<u-row customStyle="margin:20rpx;" justify="space-between">
					<u-row customStyle="padding:14rpx 14rpx;border-radius: 50rpx;flex:1;background:#85a3ff14"
						class="u-info" @click="commentCheck(false,data.coid,data.author);">
						<u-icon name="edit-pen" size="20"></u-icon>
						<text style="margin-left:10rpx;font-size: 28rpx;">回复{{data.author}}</text>
					</u-row>
				</u-row>
				<!-- 回复评论弹窗 -->

			</template>

		</z-paging>
		<u-popup :show="showComment" @close="showComment = false" round="20"
			:customStyle="{transform: `translateY(${-keyboardHeight+'px'})`,transition:'transform 0.3s ease-in-out',padding:30+'rpx'}">
			<u--textarea :adjustPosition="false" :cursorSpacing="40" type="textarea" v-model="commentText"
				:placeholder="`回复${replyWho}`" border="none"
				customStyle="background:#85a3ff14;padding:4rpx 10rpx;border-radius:20rpx"></u--textarea>
			<u-row customStyle="margin-top:20rpx" justify="space-between">
				<u-col span="6">
					<u-row justify="space-between">
						<block v-for="(item,index) in cBtn" :key="index">
							<u-icon :name="item.icon" size="24" @click="cBtnTap(item.name)"></u-icon>
						</block>
					</u-row>
				</u-col>
				<view>
					<u-button shape="circle" color="#a899e6" customStyle="padding:4rpx,6rpx;height:50rpx;width:120rpx"
						text="发送" @click="reply"></u-button>
				</view>
			</u-row>
			<!-- 隐藏面板 -->
			<block v-if="showComemntBtn == '表情'">
				<!-- 这里加表情 -->
				<block v-for="(one,oneIndex) in emojiData" :key="oneIndex">
					<swiper style="height: 120px;" v-show="emojiIndex == oneIndex">
						<swiper-item v-for="(two,twoIndex) in one.list" :key="twoIndex">
							<u-row justify="space-between" customStyle="flex-wrap:wrap">
								<image :src="one.base+one.slug+'_'+three+'.'+one.format" v-for="(three,key) in two"
									:key="key" mode="aspectFill" style="width: 100rpx;height: 100rpx;margin: 10rpx;"
									@click="commentText += `[${one.name}_${key}]`"></image>
							</u-row>
						</swiper-item>
					</swiper>
				</block>
				<u-tabs :list="emojiData" :current="emojiIndex" lineHeight="3" lineColor="#a899e6"
					itemStyle="height: 24px;"
					:activeStyle="{color: '#303133',fontWeight: 'bold',transform: 'scale(1.05)'}"
					:inactiveStyle="{color: '#606266',transform: 'scale(1)'}" @change="emojiIndex = $event.index"
					style="position: static;"></u-tabs>
			</block>
		</u-popup>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				data: null,
				comments: [],
				pid: 0,
				keyboardHeight: 0,
				showComment: false,
				showComemntBtn: null,
				commentText: '',
				emojiData: [],
				emojiIndex: 0,
				cBtn: [{
					name: '表情',
					icon: 'heart',
				}],
				replyWho: '',
				loading: true,
			}
		},
		beforeRouteLeave(to, from, next) {
			if (this.showComment) {
				this.showComment = false;
				next(false)
				this.$Router.$lockStatus = false
			} else {
				next();
			}
		
		},
		created() {
			
			this.formatEmojiData()
		},
		onShow() {
			uni.onKeyboardHeightChange(data => {
				this.keyboardHeight = data.height
			})
		},
		onLoad(params) {
			this.data = uni.getStorageSync('subComment_' + params.id)
		},
		onUnload() {
			// 取消键盘监听
			uni.offKeyboardHeightChange(data=>{
				console.log('取消了')
			})
			
		},
		methods: {
			getComments(page, limit) {
				this.$http.get('/typechoComments/commentsList', {
					params: {
						page,
						limit,
						searchParams: JSON.stringify({
							cid: this.data.cid,
							type: 'comment',
							allparent: this.data.coid,
						}),
						order: 'created asc'
					}
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.$refs.paging.complete(res.data.data)
					}
					setTimeout(() => {
						this.loading = false
					}, 1000)
				})
			},
			commentCheck(status, pid, reply) {
				this.pid = pid
				this.replyWho = reply
				if (!status) this.pid = pid;
				this.showComment = true
			},
			reply() {
				if (this.commentText.length < 3) {
					uni.$u.toast('再多说点吧~')
					return;
				};
				let params = JSON.stringify(params = {
					cid: this.data.cid,
					parent: this.pid,
					allparent: this.data.coid,
					text: this.commentText,
				})
				this.$http.post('/typechoComments/commentsAdd', {
					params
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						uni.$u.toast('已发送~')
						this.commentText = null
						this.showComment = false
						this.$refs.paging.reload()
						this.$emit('subReply', true)
					}
				})
			},
			formatText(item) {
				let text = `
			    <div style="word-break:break-all">
			      回复&nbsp;
			      <span style="color:#85a3ff" v-on:click="goProfile(item)">
			        ${item.parentComments.author}：</span> 
					${item.text}
			    </div>
			  `;
				return text;
			},
			goProfile(id) {
				console.log('点击了')
				this.$Router.push({
					path: '/pages/profile/profile',
					query: {
						id
					}
				})
			},
			formatEmoji(html) {
				return html.replace(/\[([^\]]+)_([^\]]+)\]/g, (match, name, key) => {
					const emoji = this.$emoji.data.find(e => e.name === name);
					if (emoji) {
						const src = `${emoji.base}${emoji.slug}_${emoji.list[key]}.${emoji.format}`;
						return `<img src=".${src}" style="width:80rpx;height:80rpx">`;
					}
					// 如果找不到对应的 emoji，可能需要返回原始的字符串或者给出一些提示
					return match;
				})
			},
			formatEmojiData() {
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
				if (name == this.showComemntBtn) this.showComemntBtn = null;
				else this.showComemntBtn = name
				console.log(name)
			},
		}
	}
</script>

<style>
</style>