

import { BaseItem, registerAbility } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";
import "modifier_linken_sphere";

@reloadable
@registerAbility()
class item_linken_sphere extends BaseItem{
    constructor(){
        print("item_linken_sphere constructor")
        super()
    }

    GetIntrinsicModifierName(): string {
        return "modifier_linken_sphere"
    }

    GetCooldown(level: number): number {
        return 5
    }

    GetManaCost(level: number): number {
        return 50
    }

}