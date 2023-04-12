

import { BaseAbility, registerAbility } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";
import "modifier_sven_great_cleave_lua";


@reloadable
@registerAbility()
class sven_great_cleave_lua extends BaseAbility{
    constructor(){
        print("sven_great_cleave_lua constructor")
        super()
    }

    GetIntrinsicModifierName(): string {
        return "modifier_sven_great_cleave_lua"
    }
}