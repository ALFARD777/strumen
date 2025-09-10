import { IconMenu2, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMenuStore } from "../store/menu";

const NavbarToggle = () => {
	const isOpen = useMenuStore((s) => s.isOpen);
	const toggleMenu = useMenuStore((s) => s.toggle);

	return (
		<button
			type="button"
			aria-label="Переключить видимость меню"
			onClick={() => toggleMenu()}
		>
			<AnimatePresence mode="wait">
				{isOpen ? (
					<motion.div
						key="x"
						initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
						animate={{ opacity: 1, rotate: 0, scale: 1 }}
						exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
						transition={{ duration: 0.2 }}
					>
						<IconX size={22} />
					</motion.div>
				) : (
					<motion.div
						key="menu"
						initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
						animate={{ opacity: 1, rotate: 0, scale: 1 }}
						exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
						transition={{ duration: 0.2 }}
					>
						<IconMenu2 size={22} />
					</motion.div>
				)}
			</AnimatePresence>
		</button>
	);
};

export default NavbarToggle;
