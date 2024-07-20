import { ComposerCard } from "@/components/cards/ComposerCard";
import { CompositionCard } from "@/components/cards/CompositionCard";
import { ListCard } from "@/components/cards/ListCard";
import { UserCard } from "@/components/cards/UserCard";

export type SearchResults = {
	compositions: Parameters<typeof CompositionCard>[0]["composition"][];
	composers: Parameters<typeof ComposerCard>[0]["composer"][];
	lists: Parameters<typeof ListCard>[0]["list"][];
	users: Parameters<typeof UserCard>[0]["user"][];
};

export const emptySearchResults: SearchResults = {
	compositions: [],
	composers: [],
	lists: [],
	users: [],
};
