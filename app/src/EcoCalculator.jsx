import { useState } from "react";
import data from "./buildings.json";
import woodIcon from "./assets/woodRes.webp";
import clayIcon from "./assets/clayRes.webp";
import ironIcon from "./assets/ironRes.webp";

import tableHeader from "./assets/tableheader_bg3.webp";

import formatNumber from "./assets/uti/formatNumber";

const EcoCalculator = () => {
    const buildings = data.buildings;
    const [villages, setVillages] = useState([]);
    const [serverSpeed, setServerSpeed] = useState(1);
    const [bonus, setBonus] = useState(0);

    const [importData, setImportData] = useState("");

    const handleImport = () => {
        const newVillages = parseVillageData(importData);
        if (newVillages.length) {
            setVillages([...villages, ...newVillages])
            setImportData("");
        };

    };

    const buildingNames = {
        woodCutter: "Tartak",
        clayYard: "Cegielnia",
        ironWorks: "Huta Żelaza",
    };

    const calcVillageProduction = (village) => {
        const resources = ["woodCutter", "clayYard", "ironWorks"];
        let total = { wood: 0, clay: 0, iron: 0 };

        resources.forEach((res) => {
            const level = village[res];
            const prod = buildings[res]?.levels[level]?.produce || 0;

            switch (res) {
                case "woodCutter":
                    total.wood += prod;
                    break;
                case "clayYard":
                    total.clay += prod;
                    break;
                case "ironWorks":
                    total.iron += prod;
                    break;
            }
        });

        total.wood = Math.round(total.wood * serverSpeed * (1 + bonus / 100));
        total.clay = Math.round(total.clay * serverSpeed * (1 + bonus / 100));
        total.iron = Math.round(total.iron * serverSpeed * (1 + bonus / 100));

        return total;
    };

    const totalProduction = villages.reduce(
        (acc, village) => {
            const vProd = calcVillageProduction(village);
            acc.wood += vProd.wood;
            acc.clay += vProd.clay;
            acc.iron += vProd.iron;
            return acc;
        },
        { wood: 0, clay: 0, iron: 0 }
    );

    const handleLevelChange = (index, building, value) => {
        const newVillages = [...villages];
        const parsed = parseInt(value, 10);
        newVillages[index][building] = isNaN(parsed) ? 0 : parsed;
        setVillages(newVillages);
    };

    const parseVillageData = (rawData) => {
        const villages = [];
        const lines = rawData.split("\n");

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            if (line.startsWith("Wioska") || line.startsWith("P.")) continue;

            const parts = line.split(/\s+/);

            if (parts.length < 17) continue;

            const name = parts[0] + " " + parts[1]; // e.g., "000 (481|571)"
            const points = parseFloat(parts[2].replace(".", "")); // e.g., 10.196 -> 10196
            const lumberYard = parseInt(parts[12], 10);
            const clayYard = parseInt(parts[13], 10);
            const ironWorks = parseInt(parts[14], 10);

            villages.push({
                name,
                points,
                woodCutter: lumberYard,
                clayYard: clayYard,
                ironWorks: ironWorks,
            });
        }

        return villages;
    };

    return (
        <div className="p-4 space-y-4">
            {/* Global Settings */}
            <div className="flex gap-4">
                <div>
                    <label>Prędkość Serwera:</label>
                    <input
                        type="number"
                        value={serverSpeed}
                        onChange={(e) => setServerSpeed(parseFloat(e.target.value) || 1)}
                        className="border px-2 py-1 rounded ml-2 w-20"
                    />
                </div>
                <div>
                    <label>Bonus %:</label>
                    <input
                        type="number"
                        value={bonus}
                        onChange={(e) => setBonus(parseFloat(e.target.value) || 0)}
                        className="border px-2 py-1 rounded ml-2 w-20"
                    />
                </div>
            </div>

            {/* Total Production */}
            <div className="mt-4 rounded bg-[#ecd7ac] border border-[#7d510f] font-semibold">
                <h3
                    className="font-semibold px-1"
                    style={{ backgroundImage: `url(${tableHeader})`, backgroundRepeat: 'repeat-x' }}
                >
                    Łączna produkcja: 1h
                </h3>
                <div className="py-1">
                    <div className="flex gap-1 pl-1">
                        <img src={woodIcon} alt="" />{formatNumber(totalProduction.wood)}
                    </div>
                    <div className="flex gap-1 pl-1">
                        <img src={clayIcon} alt="" />{formatNumber(totalProduction.clay)}
                    </div>
                    <div className="flex gap-1 pl-1">
                        <img src={ironIcon} alt="" />{formatNumber(totalProduction.iron)}
                    </div>
                </div>
            </div>

            <div className="mt-2 rounded bg-[#ecd7ac] border border-[#7d510f] font-semibold">
                <h3
                    className="font-semibold px-1"
                    style={{ backgroundImage: `url(${tableHeader})`, backgroundRepeat: 'repeat-x' }}
                >
                    Łączna produkcja: 24h
                </h3>
                <div className="py-1">
                    <div className="flex gap-1 pl-1">
                        <img src={woodIcon} alt="" />{formatNumber(totalProduction.wood * 24)}
                    </div>
                    <div className="flex gap-1 pl-1">
                        <img src={clayIcon} alt="" />{formatNumber(totalProduction.clay * 24)}
                    </div>
                    <div className="flex gap-1 pl-1">
                        <img src={ironIcon} alt="" />{formatNumber(totalProduction.iron * 24)}
                    </div>
                </div>
            </div>

            {/* Villages */}
            {villages.length > 0 && villages.map((village, idx) => (
                <div
                    key={idx}
                    className="bg-[#ecd7ac] border border-[#7d510f] rounded space-y-2"
                    style={{ boxShadow: "1px 1px 2px 1px rgba(60, 30, 0, 0.2)" }}
                >
                    <h3
                        className="font-semibold px-1"
                        style={{ backgroundImage: `url(${tableHeader})`, backgroundRepeat: 'repeat-x' }}
                    >
                        {village.name === "" ? `Wioska ${idx + 1}` : village.name}
                    </h3>
                    <div className="px-1">
                        <div className="flex gap-2">
                            {["woodCutter", "clayYard", "ironWorks"].map((building) => (
                                <div key={building} className="flex items-center gap-2">
                                    <label>{buildingNames[building]}:</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={30}
                                        value={village[building]}
                                        onChange={(e) =>
                                            handleLevelChange(idx, building, e.target.value)
                                        }
                                        className="border border-[#7d510f] text-center px-1 py-1 rounded w-10"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="font-medium my-2 flex gap-4">
                            <p>Produkcja na godzinę:</p>
                            <div className="flex gap-1">
                                <img src={woodIcon} alt="" />{formatNumber(calcVillageProduction(village).wood)}
                            </div>
                            <div className="flex gap-1 pl-1 border-l border-[#7d510f]">
                                <img src={clayIcon} alt="" />{formatNumber(calcVillageProduction(village).clay)}
                            </div>
                            <div className="flex gap-1 pl-1 border-l border-[#7d510f]">
                                <img src={ironIcon} alt="" />{formatNumber(calcVillageProduction(village).iron)}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Import Textarea */}
            <div className="my-4">
                <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    className="w-full border p-2 rounded h-32"
                    placeholder="Wklej dane wiosek tutaj..."
                />
                <div className=" flex justify-between items-center">
                    <button
                        onClick={handleImport}
                        className="inline-block px-3 py-1 mx-1 text-center font-verdana font-bold text-[12px] leading-normal cursor-pointer rounded border border-black text-white bg-gradient-to-b from-[#947a62] via-[#7b5c3d] to-[#6c4824] whitespace-nowrap
               hover:bg-[linear-gradient(to_bottom,_#b69471_0%,_#9f764d_22%,_#8f6133_30%,_#6c4d2d_100%)]"
                    >
                        Importuj Wioski
                    </button>
                    <a className="font-bold text-[#603000] hover:text-[#e01f0f]" href="https://gyazo.com/f31742ff80be48666e39d224bd8b8605">Jak używać</a>
                </div>
            </div>
        </div>

    );
};

export default EcoCalculator;
