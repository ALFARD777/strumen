"use client";

import { toast } from "sonner";

const ButtonPhone = ({
	phone,
	viber = false,
}: {
	phone: string;
	viber?: boolean;
}) => {
	const formatPhone = (phoneNumber: string) => {
		const cleaned = phoneNumber.replace(/\D/g, "");

		if (cleaned.length === 12 && cleaned.startsWith("375")) {
			return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)}-${cleaned.slice(8, 10)}-${cleaned.slice(10)}`;
		}

		if (cleaned.length === 9) {
			return `+375 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)}-${cleaned.slice(5, 7)}-${cleaned.slice(7)}`;
		}

		return phoneNumber;
	};

	const handleClick = () => {
		if (viber || window.innerWidth > 1024) {
			navigator.clipboard.writeText(phone);
			toast.success("Номер скопирован в буфер обмена");
		} else {
			window.location.href = `tel:${phone}`;
		}
	};

	return (
		<button
			className="hover:underline flex items-center cursor-pointer"
			onClick={handleClick}
		>
			{formatPhone(phone)}
			{viber && (
				<span className="inline-block ml-1 px-1.5 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">
					Viber
				</span>
			)}
		</button>
	);
};

export { ButtonPhone };
