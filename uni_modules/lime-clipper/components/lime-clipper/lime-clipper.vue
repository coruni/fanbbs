<template>
	<view>
		<image :src="url" v-if="url" mode="widthFix"></image>
		<l-clipper v-if="show" @success="url = $event.url; show = false" @cancel="show = false"  />
		<button @tap="show = true">裁剪</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '',
				show: false
			}
		}
	}
</script>

<style>
</style>
