"use client";

import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { genericClient } from "@/lib/genericClient";
import toast from "react-hot-toast";

type ISearchGuardRequest = {
    text: string;
};

type ISearchGuardResponse = Array<IGuard>;

const SearchGuard: React.FC = () => {
    const router = useRouter();
    const [text, setText] = useState<string>("");
    const [suggestions, setSuggestions] = useState<IGuard[]>([]);

    const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setText(value);

        if (value) {
            const response = await genericClient<ISearchGuardRequest, ISearchGuardResponse>({
                url: "/api/search/guards",
                method: "GET",
                params: { text: value },
                requireAuth: true,
            });

            if (response.error) {
                toast.error(response.error);
                return;
            }

            if (response.data) {
                setSuggestions(response.data);
                return;
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion: IGuard) => {
        setText("");
        router.push(`/guard/${suggestion.id}`);
        setSuggestions([]);
    };

    return (
        <div className="relative w-full max-w-md mx-auto">
            <Input
                type="text"
                value={text}
                onChange={handleInputChange}
                placeholder="Guard name, License Number, State..."
            />
            {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 overflow-hidden z-10">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-start"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            <div>
                                <div className="text-lg font-semibold text-gray-800">
                                    {suggestion.firstName} {suggestion.lastName}
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <span>{suggestion.licenseNumber}</span>
                                    <span className="mx-1">•</span>
                                    <span className="font-medium">{suggestion.state}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchGuard;
