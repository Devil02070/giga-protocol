import { LPVault } from "@/utils/mongo";
import Body from "./Body";
export default async function AppPage() {
    const fetchData = async () => {
        const data = await fetch(`${process.env.SITE_URL}/api/vault`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((response) => response.data)
            .catch((err) => console.error(err));
        return data;
    };
    const data: Array<LPVault> = await fetchData()
    return (
        <Body vaults={data}/>
    )
}