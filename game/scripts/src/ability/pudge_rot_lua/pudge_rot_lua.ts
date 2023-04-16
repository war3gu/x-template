

import { BaseAbility, registerAbility } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";
import "modifier_pudge_rot_lua"

@reloadable
@registerAbility()
class pudge_rot_lua extends BaseAbility{
    constructor(){
        print("pudge_rot_lua constructor")
        super()
    }

    ProcsMagicStick(): boolean {
        return false
    }

    OnToggle(): void {
        if (this.GetToggleState()) {
            this.GetCaster().AddNewModifier(this.GetCaster(), this, "modifier_pudge_rot_lua", null);
            if (!this.GetCaster().IsChanneling()) {
                this.GetCaster().StartGesture(GameActivity.DOTA_CAST_ABILITY_ROT);
            }
        } 
        else {
            let hRotBuff = this.GetCaster().FindModifierByName("modifier_pudge_rot_lua");
            if (hRotBuff !== null) {
                hRotBuff.Destroy();
            }
        }       
    }
}