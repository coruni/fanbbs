<template>
	<view>
		<z-paging ref="paging" @query="getData" v-model="article">
			<template #top>
				<u-navbar title="我的收藏" placeholder autoBack></u-navbar>
			</template>
			<view>

			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				article: []
			};
		},
		methods: {
			getData(page, limit) {
				this.$http.post('/typechoUserlog/markList', {
					page,
					limit,

				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.$refs.paging.complete(res.data.data)
					}
				})
			}
		}
	}
</script>

<style lang="scss">

</style>