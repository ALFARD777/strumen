/**
 * Обрезает текст до предпросмотра, не разрывая слова и предложения.
 * Если текст длиннее maxLength, обрезает по ближайшему завершённому предложению или слову и добавляет троеточие.
 * @param text - исходный текст
 * @param maxLength - максимальная длина предпросмотра (по умолчанию 480 символов)
 * @returns обрезанный текст с троеточием, если был обрезан
 */
export function previewText(text: string, maxLength: number = 480): string {
	if (!text || text.length <= maxLength) return text;

	const sentenceEnd = text.lastIndexOf(".", maxLength);

	if (sentenceEnd !== -1 && sentenceEnd > maxLength * 0.5) {
		return text.slice(0, sentenceEnd) + "...";
	}

	const lastSpace = text.lastIndexOf(" ", maxLength);

	if (lastSpace !== -1 && lastSpace > maxLength * 0.5) {
		return text.slice(0, lastSpace) + "...";
	}

	return text.slice(0, maxLength) + "...";
}
