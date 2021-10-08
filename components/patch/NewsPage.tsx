import { Patch, PatchMap } from "../../util/databaseSingleton";
import { PatchSectionSmall } from "./PatchSectionSmall";

export function NewsPage({ patches }: { patches: PatchMap }) {
  const groupedPatches: GroupedPatches = Object.values(patches).reduce(
    reducePatchesToMajorPatches,
    {}
  );

  for (const index in groupedPatches) {
    let groupReleased = true;
    for (const patch of groupedPatches[index]) {
      if (patch.released === false) groupReleased = false;
    }
    if (groupReleased) delete groupedPatches[index];
  }

  return (
    <div>
      {Object.values(groupedPatches).map((majorPatchSection: Patch[]) => (
        <div className="flex flex-col mb-5">
          <div className="flex flex-row bg-gray-200 justify-center">
            <div className="flex flex-col text-center mt-2 mb-2 ">
              <img
                src={"/patchBanners/" + majorPatchSection[0].id + ".png"}
                className="inline md:col-span-1 justify-self-center pb-2"
                width={400}
                height={200}
              ></img>
              <div className="ml-2 text-2xl">
                {majorPatchSection[0].formattedDate}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 pr-5 pl-5">
            {Object.values(majorPatchSection).map((patch) => (
              <PatchSectionSmall
                patch={patch}
                key={patch.id}
              ></PatchSectionSmall>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function reducePatchesToMajorPatches(
  accumulator: GroupedPatches,
  patch: Patch
) {
  if (patch.type === "major") {
    accumulator[patch.id] = [patch];
  } else {
    const lastMajorPatchId = Object.keys(accumulator).pop()!;
    accumulator[lastMajorPatchId].push(patch);
  }
  return accumulator;
}

interface GroupedPatches {
  [key: string]: Patch[];
}
