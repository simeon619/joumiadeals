import { create } from "zustand";
import { combine } from "zustand/middleware";

export const inputOTPtel = create(
	combine(
		{
			value: 0 as number,
			error: '' as string,
		},
		(set) => ({
            setValue: (value: number) => {
                set(() => ({
                    value,
                }));
            },
            setError: (value: string) => {
                set(() => ({
                    error : value,
                }));
            },
		})
	)
);