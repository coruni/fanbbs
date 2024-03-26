<template>
	<view :style="{height:height+'px'}" class="content">
		<u-navbar title="幸运抽奖" :titleStyle="{color:'white'}" autoBack bgColor="transparent">
			<view slot="left">
				<i class="ess mgc_left_line" style="font-size: 60rpx;color: white;"></i>
			</view>
		</u-navbar>
		<LuckyGrid ref="lottery" width="600rpx" height="600rpx" :rows="3" :cols="3" :blocks="blocks"
			:prizes="prizes" :defaultStyle="defaultStyle" @start="play()" @end="endCallBack">
		</LuckyGrid>
		<view style="position: absolute; bottom: 60rpx;">
			<view style="width: 58vw;padding: 20rpx 0;text-align: center;" @click="play()">
				<text style="font-size: 40rpx;color: white;font-Weight: bold;">开始抽奖！</text>
			</view>
			
		</view>
	</view>
</template>

<script>
	import LuckyGrid from 'uni-luck-draw/lucky-grid' // 九宫格;
	export default {
		components: {
			LuckyGrid
		},

		data() {
			return {
				height: 0,
				blocks: [{}],
				prizes: [],
				defaultStyle: {
					background: '#b8c5f2',

				},
				lottery: null,
			};
		},
		onLoad() {
			this.getData()
			this.height = uni.getSystemInfoSync().windowHeight
		},
		onReady	(){
			this.lottery = this.$refs.lottery;
		},
		methods: {
			getData() {
				const typeToImage = {
					'point': '/static/lottery/coin.png',
					'vip': '/static/lottery/vip.png',
				};
				this.$http.get('/raffle/list', {
					page: 1,
					limit: 8
				}).then(res => {
					if (res.data.code == 200) {
					    const items = res.data.data.data;
					    const gridSize = 3;
					    const prizes = [];
					    items.forEach((item, index) => {
					    
					        const row = Math.floor(index / gridSize);
					        const col = Math.floor(index % gridSize);
					        const src = typeToImage[item.type] || item.image;
					        
					        prizes.push({
					            data: item,
					            x: col,
					            y: row,
					            id: item.id,
					            fonts: [{
					                text: item.name,
					                fontColor: 'white',
					                fontSize: '16px',
					                top: '70%'
					            }],
					            imgs: [{
					                src,
					                width: '40%',
					                top: '30%'
					            }]
					        });
					    });
					
					    this.prizes = prizes;
					    
					}
				});
			},
			async play() {
				this.$refs.lottery.play()
				let res = await this.raffle();
				if (res.data.code == 201) {
					this.$refs.lottery.stop(false);
					uni.$u.toast(res.data.msg)
					return;
				}
				console.log(res)
				let prizeIndex = this.findPrizeIndex(res.data.data.id);
				setTimeout(() => {
					this.$refs.lottery.stop(prizeIndex)
				}, 3000)
			},
			raffle() {
				return new Promise((resolve, reject) => {
					this.$http.post('/raffle/raffle').then(res => {
						resolve(res)
					})
				})
			},
			findPrizeIndex(id) {
				let prizes = [...this.prizes]; // 奖品数据数组
				for (let i = 0; i < prizes.length; i++) {
					if (prizes[i].id === id) {
						return i; // 返回找到的奖品索引
					}
				}
				return -1; // 如果没有找到匹配的id，返回-1
			},
			endCallBack(e) {
				if (e.data && e.data.name) {
					uni.$u.toast(`恭喜你抽中了${e.data.name}！`)
				}
			},

		}

	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-image: url('/static/lottery/5f64ad5410225.jpg');
		background-size: cover;
		background-position: center;
	}
</style>