<template>
	<z-paging-swiper>
		<template #top>
			<u-navbar title="我的小摊" autoBack placeholder>
				<view slot="left" style="display:flex;align-items: center;">
					<i class="ess icon-left_line" style="font-size: 60rpx;"></i>
				</view>
				<i class="ess icon-add_line" slot="right" style="font-size: 40rpx;"></i>
			</u-navbar>
			<z-tabs :list="list" ref="tab" activeColor="#85a3ff" :current="tabIndex"
				@change="tabIndex =$event"></z-tabs>
		</template>
		<swiper style="height: 100%;" :current="tabIndex"
			@animationfinish="tabIndex = $event.detail.current;$refs.tab.unlockDx()"
			@transition="$refs.tab.setDx($event.detail.dx)">
			<swiper-item v-for="(item,index) in list" :key="index">
				123
			</swiper-item>
		</swiper>
	</z-paging-swiper>
</template>

<script>
	export default {
		data() {
			return {
				tabIndex: 0,
				list: [{
						name: '未支付',
						order: [{
							order: 'paid',
							value: 0
						}]

					},
					{
						name: '待发货',
						order: [{
								order: 'paid',
								value: 1,
							},
							{
								order: 'isTracking',
								value: 0,
							}
						]
					},
					{
						name: '已完成',
						order: [{
							order: ''
						}]
					}
				]
			};
		}
	}
</script>

<style lang="scss">

</style>