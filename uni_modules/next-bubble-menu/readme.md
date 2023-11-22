#next-bubble-menu(气泡菜单)

作者   
`920804994@qq.com`

> 遇到问题或有建议可以加入QQ群(<font color=#f00>455948571</font>)反馈  
> 如果觉得组件不错，<font color=#f00>给五星鼓励鼓励</font>咯！



## 使用

>[从uniapp插件市场导入](https://ext.dcloud.net.cn/plugin?name=next-bubble-menu)



### 预览

***

|                 						功能预览               				   		        	|   
| :-----------------------------------------------------------------------: |
| ![](https://lixueshiaa.github.io/webtest/www/static/next-bubble-menu.gif) |



###  使用实例（template部分）
```html
<template>
	<view style="height: 100px"></view>
	<u-row>
		<u-col :span="4">
			<view  class="item">
				<next-bubble-menu :d-width="200" :dataList="dataList" bingEleId="test1">
					<view id="test1" class="flex-line"><text>位置1</text></view>
				</next-bubble-menu>
			</view>
		</u-col>
		<u-col :span="4">
			<view  class="item">
				<next-bubble-menu :d-width="200" :dataList="dataList" bingEleId="test2">
					<view id="test2" class="flex-line"><text>位置2</text></view>
				</next-bubble-menu>
			</view>
		</u-col>
		<u-col :span="4">
			<view  class="item">
				<next-bubble-menu :d-width="200" :dataList="dataList" bingEleId="test3">
					<view id="test3" class="flex-line"><text>位置3</text></view>
				</next-bubble-menu>
			</view>
		</u-col>
	</u-row>
	<u-row>
		<u-col :span="6">
			<view  class="item">
				
			</view>
		</u-col>
		<u-col :span="6">
			<view  class="item">
			
			</view>
		</u-col>
	</u-row>
	<u-row>
		<u-col :span="12">
			<view  class="item">
				<next-bubble-menu :d-width="200" :dataList="dataList" bingEleId="test6">
					<view id="test6" class="flex-line"><text>位置6</text></view>
				</next-bubble-menu>
			</view>
		</u-col>
	</u-row>
	<view class="flex-btn">	
		<view class="item">
			<next-bubble-menu :d-width="200" :dataList="dataList" bingEleId="test7">
				<view id="test7" class="flex-line"><text>固定位置7</text></view>
			</next-bubble-menu>
		</view>		
		</view>
</template>
```

### vue3使用
```js
<script setup lang="ts">
import {ref, unref} from "vue"

const dataList = [
	{
		text: '测试一',
		iconSrc: 'https://i-1.lanrentuku.com/2020/9/15/752b7419-0de1-4515-8d2c-63e7b7df007c.png?imageView2/2/w/500'
	},
	{
		text: '测试二',
		iconSrc: 'https://bpic.51yuansu.com/pic2/cover/00/38/01/58122c53d1ca5_610.jpg'
	},
	{
		text: '测试三',
		iconSrc: 'https://i-1.lanrentuku.com/2020/10/27/73be0f11-4027-4e5c-8f8f-be31fa4d2834.png?imageView2/2/w/500'
	}
]
</script>

<style lang="scss">
	.item {
		display: flex;
		height: 100px;
		align-items: center;
		justify-content: center;
		.flex-line {
			display: inline-flex;
			border: 1rpx solid #ccc;
			padding: 10rpx;
			
		}
	}
	.flex-btn {
		position: fixed;
		top: 20px;
		right:20px;
		display: inline-flex;
	}
</style>
<style lang="scss">
page {
  background: #ccc;
}
</style>
```

### vue2使用
```js
<script>
export default {
	data: () => {
		dataList: [
			{
				text: '测试一',
				iconSrc: 'https://i-1.lanrentuku.com/2020/9/15/752b7419-0de1-4515-8d2c-63e7b7df007c.png?imageView2/2/w/500'
			},
			{
				text: '测试二',
				iconSrc: 'https://bpic.51yuansu.com/pic2/cover/00/38/01/58122c53d1ca5_610.jpg'
			},
			{
				text: '测试三',
				iconSrc: 'https://i-1.lanrentuku.com/2020/10/27/73be0f11-4027-4e5c-8f8f-be31fa4d2834.png?imageView2/2/w/500'
			}
		]
	}
}

</script>

<style lang="scss">
	.item {
		display: flex;
		height: 100px;
		align-items: center;
		justify-content: center;
		.flex-line {
			display: inline-flex;
			border: 1rpx solid #ccc;
			padding: 10rpx;
			
		}
	}
	.flex-btn {
		position: fixed;
		top: 20px;
		right:20px;
		display: inline-flex;
	}
</style>
<style lang="scss">
page {
  background: #ccc;
}
</style>
```

## 参数


### next-bubble-menu Props

可选参数属性列表

|参数名				|说明																|类型														|是否必填	|默认值								|可选值			|
|----				|----																	|----														|----			|----									|----				|
|bingEleId				|绑定元素的id										|String													|是				|-										|-					|
|dataList			|气泡框数据源			 									|Array													|是				|[]										|-					|
|hasBar			|是否存在bar														|Boolean												|否				|true									|false			|
|radius	|气泡框圆角大小（单位：rpx）								|Number													|否				|8										|-					|
|dWidth			|	气泡框宽度（单位：rpx）							|Number													|否				|0										|-					|
|dHeight			|气泡框高度（单位：rpx）							|Number													|否				|0								 		|-					|
|dMaxHeight			|	气泡框最大高度（单位：rpx）			|Number													|否				|400				 					|-					|
|relativeAllow|	气泡框相对arrow图标的位置					|Number													|否				|-30									|false			|
