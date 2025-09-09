"use client";

export default function Email({ email }: { email: string }) {
	return (
		<a href={`mailto:${email}`} className="hover:underline">
			{email}
		</a>
	);
}
