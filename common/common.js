export function formatTime(time) {
	const now = new Date();
	const targetDate = new Date(time * 1000); // 转换成毫秒
	const timeDiff = now - targetDate;

	if (timeDiff < 60000) {
		return '几秒前';
	} else if (timeDiff < 3600000) {
		const minutes = Math.floor(timeDiff / 60000);
		return `${minutes} 分钟前`;
	} else if (
		targetDate.getDate() === now.getDate() &&
		targetDate.getMonth() === now.getMonth() &&
		targetDate.getFullYear() === now.getFullYear()
	) {
		const hours = Math.floor(timeDiff / 3600000);
		return `${hours} 小时前`;
	} else if (
		now.getDate() - targetDate.getDate() === 1 &&
		now.getMonth() === targetDate.getMonth() &&
		now.getFullYear() === targetDate.getFullYear()
	) {
		return '昨天';
	} else {
		const month = targetDate.getMonth() + 1;
		const day = targetDate.getDate();
		return `${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
	}
}
