<template>
	<view>
		<z-paging ref="paging" v-model="videos" @query="getData">
			
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				videos: []
			}
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/article/articleList', {
					params: {
						page,
						limit,
						params:JSON.stringify({
							type:'video'
						})
					}
				}).then(res=>{
					
				})
			}

		}
	}
</script>

<style>
</style>