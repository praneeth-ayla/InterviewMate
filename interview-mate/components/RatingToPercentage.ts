const convertRatingToPercentage = (rating: string): number => {
	// Check if rating is in the format "num/den" (e.g., "7/10")
	const match = rating.match(/^(\d+)\/(\d+)$/);
	if (match) {
		const numerator = parseFloat(match[1]);
		const denominator = parseFloat(match[2]);
		// Avoid division by zero
		if (denominator !== 0) {
			return Math.round((numerator / denominator) * 100);
		}
	}
	return 0; // Return 0 if the rating format is invalid or denominator is zero
};

export default convertRatingToPercentage;
