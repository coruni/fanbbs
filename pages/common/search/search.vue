<template>
	<view>
		<u-navbar placeholder style="position: relative;z-index: 10075;">
			<!-- 用slot占位取消返回图标 -->
			<view slot="left"></view>
			<view slot="center" style="flex: 1;margin: 0 20rpx;">
				<u-row justify="space-between">
					<view
						style="border: 1rpx solid #a899e6;border-radius: 50rpx;padding:10rpx;display: flex;align-items: center;flex:1">
						<u-avatar src="/static/login.png" size="20"></u-avatar>
						<u-icon size="10" color="#999" :name="showCategory?'arrow-up-fill':'arrow-down-fill'"
							style="margin-left: 20rpx;padding-right: 20rpx;margin-right: 10rpx;border-right: #a899e6 solid 1rpx;"
							@click="showCategory=!showCategory"></u-icon>
						<u-input v-model="search" :adjust-position="false" style="padding: 0 10rpx;"
							border="none"></u-input>
					</view>
					<text style="color: #a899e6;margin-left:20rpx" @click="$Router.back(1)">取消</text>

				</u-row>

			</view>
		</u-navbar>
		<u-popup mode="top" @close="showCategory = false" :show="showCategory" style="position: absolute;z-index: 10074;" round="20">
			<u-gap height="50"></u-gap>
			<z-paging ref="category" :fixed="false" height="600rpx">
				<view style="margin:0 20rpx;display: flex;flex-direction: column;">
					<block v-for="(item,index) in 20" :key="index">
						<u-row customStyle="margin-bottom: 20rpx;">
							<u-avatar src="/static/login.png" size="20"></u-avatar>
							<text>分类名称</text>
						</u-row>
					</block>
				
				</view>
			</z-paging>
			
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showCategory: false,
				search: '',

			};
		}
	}
</script>

<style lang="scss">

</style>