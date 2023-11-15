<template>
	<view>
		<z-paging ref="paging" @query="getComments" v-model="comments" :refresher-enabled="false" :fixed="false"
			height="75vh">
			<u-row align="top" customStyle="padding:30rpx">
				<view style="position: relative;">
					<u-avatar :src="data.userJson.avatar" size="30"></u-avatar>
					<image class="avatar_head" mode="aspectFill" :src="data.userJson.customize.head">
					</image>
				</view>
				
				<view style="display: flex;flex:1; flex-direction: column;margin-left: 20rpx;">
					<u-row justify="space-between">
						<text :style="{color:data.userJson.isvip?'#a899e6':''}">{{data.userJson.name}}</text>
					</u-row>
					<view style="margin-top:10rpx;word-break: break-word;">
						<u-parse :content="data.text"></u-parse>
					</view>
					<u-album :urls="data.pic.images" borderRadius="10" multiple-size="90"></u-album>
					<u-gap height="6"></u-gap>
					<u-row justify="space-between" customStyle="font-size: 24rpx;color: #aaa;">
						<text>{{$u.timeFormat(data.created,'mm-dd')}}</text>
						<u-row customStyle="flex-basis:25%" justify="space-between">
							<u-icon name="thumb-up" color="#aaa" :label="1" size="20" labelColor="#aaa"
								label-size="12"></u-icon>
							<u-icon name="thumb-down" color="#aaa" size="20" labelColor="#aaa" label-size="12"></u-icon>
						</u-row>
					</u-row>
				</view>
			</u-row>
			<u-gap height="8" bgColor="#f4f4f4"></u-gap>
			<!-- 子评论开始 -->
			<block v-for="(item,index) in comments" :key="index">
				<u-row align="top" customStyle="padding:20rpx">
					<view style="position: relative;">
						<u-avatar :src="item.userJson.avatar" size="30"></u-avatar>
						<image class="avatar_head" mode="aspectFill" :src="item.userJson.customize.head">
						</image>
					</view>
					
					<view style="display: flex;flex:1; flex-direction: column;margin-left: 20rpx;">
						<u-row justify="space-between">
							<text :style="{color:item.userJson.isvip?'#a899e6':''}">{{item.userJson.name}}</text>
						</u-row>
						<view style="margin-top:10rpx;word-break: break-word;">
							<u-parse :content="item.text"></u-parse>
						</view>
						<u-grid :col="3" :border="false" v-if="item.longtext && item.longtext.images">
							<u-grid-item v-for="(image,imageIndex) in item.longtext.images" :key="imageIndex"
								v-if="imageIndex<9" @click.native.stop="preview"
								:customStyle="{width:'210rpx',height:'210rpx',borderRadius:'20rpx',marginTop:'10rpx',marginRight:'10rpx'}">
								<image :src="image" mode="aspectFill"
									style="width:210rpx;height:210rpx;border-radius:10rpx" class="u-info-light-bg">
								</image>
							</u-grid-item>
						</u-grid>
						<u-gap height="6"></u-gap>
						<view style="border-bottom:2rpx solid #f7f7f7;padding-bottom: 20rpx;">
							<u-row justify="space-between" customStyle="font-size: 24rpx;color: #aaa;">
								<text>{{$u.timeFormat(item.created,'mm-dd')}}</text>
								<u-row customStyle="flex-basis:40%" justify="space-between">
									<u-icon name="chat" color="#aaa" label="回复" size="20" labelColor="#aaa"
										label-size="12"></u-icon>
									<u-icon name="thumb-up" color="#aaa" :label="1" size="20" labelColor="#aaa"
										label-size="12"></u-icon>
									<u-icon name="thumb-down" color="#aaa" size="20" labelColor="#aaa"
										label-size="12"></u-icon>
								</u-row>
							</u-row>
						</view>
					</view>
				</u-row>
			</block>
			<template #bottom>
				<u-row customStyle="margin:20rpx;background:#fff" justify="space-between">
					<u-row customStyle="padding:14rpx 14rpx;border-radius: 50rpx;flex:1" class="u-info-light-bg u-info"
						@click="commentCheck(false,data.id,data.userJson.name);">
						<u-icon name="edit-pen" size="20"></u-icon>
						<text style="margin-left:10rpx;font-size: 28rpx;">回复{{data.author}}</text>
					</u-row>
				</u-row>
				<!-- 回复评论弹窗 -->
			</template>
			<u-popup :show="showComment" @close="showComment = false" round="20"
				:customStyle="{transform: `translateY(${-keyboardHeight+'px'})`,transition:'transform 0.3s ease-in-out',padding:30+'rpx'}">
				<u--textarea :adjustPosition="false" :cursorSpacing="40" type="textarea" v-model="commentText"
					:placeholder="`回复${replyWho}`" border="none"
					customStyle="background:#f7f8f7;padding:4rpx 10rpx;border-radius:20rpx"></u--textarea>
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
		</z-paging>
	</view>

</template>

<script>
	export default {
		name: 'comment',
		props: {
			id: {
				type: [String, Number],
				default: 0
			},
			data: {
				type: Object,
				default: null,
			}
		},
		data() {
			return {
				comments: [],
				pid: 0,
				keyboardHeight: 0,
				showComment: false,
				showComemntBtn: null,
				commentText: null,
				cBtn: [{
					name: '表情',
					icon: 'heart',
				}],
				replyWho: '',
			}
		},
		created() {
			uni.onKeyboardHeightChange(data => {
				this.keyboardHeight = data.height
			})
		},
		methods: {
			// 动态内容与回复同于一表 @getComments
			getComments(page, limit) {
				this.$http.get('/typechoSpace/spaceList', {
					params: {
						page,
						limit,
						searchParams: JSON.stringify({
							type: 3,
							toid: this.data.id,
						})
					}
				}).then(res => {
					console.log(res,'回复')
					if (res.data.code) {
						let list =[];
						for(let i in res.data.data){
							let data =res.data.data[i]
							data.userJson.customize = JSON.parse(data.userJson.customize)
							list.push(data)
						}
						this.$refs.paging.complete(list)
					}
				})
			},
			commentCheck(status, pid, reply) {
				this.pid = pid
				this.replyWho = reply
				if (!status) this.pid = pid;
				this.showComment = true
			},
			reply() {
				if (this.commentText.length < 4) {
					uni.$u.toast('再多说点吧~')
					return;
				};
				let params = {
					toid: this.data.id,
					type: 3, // 回复类型为3
					text: this.commentText,
				}
				this.$http.post('/typechoSpace/addSpace', {
					...params
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						uni.$u.toast('已发送~')
						this.commentText = null
						this.showComment = false
						this.$refs.paging.reload()
					} else {
						uni.$u.toast(res.data.msg)
					}
				})
			},
		}
	}
</script>

<style>
</style>