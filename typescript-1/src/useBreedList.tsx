import { useState, useEffect } from "react";
import { Animal, BreedListAPIReponse } from "./APIResponsesTypes";

const localCache: {
  [index: string]: string[];
} = {};

type Status = "unloaded" | "loading" | "loaded";

export default function useBreedList(animal: Animal) {
  const [breedList, setBreedList] = useState<string[]>([]);
  const [status, setStatus] = useState("unloaded" as Status);

  useEffect(() => {
    if (!animal) {
      setBreedList([]);
    } else if (localCache[animal]) {
      setBreedList(localCache[animal]);
    } else {
      void requestBreedList();
    }

    async function requestBreedList() {
      setBreedList([]);
      setStatus("loading");
      const res = await fetch(
        `http://pets-v2.dev-apis.com/breeds?animal=${animal}`
      );
      const json = (await res.json()) as BreedListAPIReponse;
      localCache[animal] = json.breeds || [];
      setBreedList(localCache[animal]);
      setStatus("loaded");
    }
  }, [animal]);

  return [breedList, status] as [string[], Status];
}
