

import { BaseModifier, registerModifier } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";


@reloadable
@registerModifier()
class modifier_crystal_maiden_arcane_aura_lua_effect extends BaseModifier{

    regen_self:number
    regen_ally:number

    constructor(){
        print("modifier_crystal_maiden_arcane_aura_lua_effect constructor")
        super()
    }

    IsHidden(): boolean {
        return false
    }

    IsDebuff(): boolean {
        return false
    }

    IsPurgable(): boolean {
        return false
    }

    OnCreated(params: object): void {
        this.regen_ally = this.GetAbility().GetSpecialValueFor("mana_regen_self")
        this.regen_self = this.GetAbility().GetSpecialValueFor("mana_regen")
    }

    OnRefresh(params: object): void {
        this.regen_ally = this.GetAbility().GetSpecialValueFor("mana_regen_self")
        this.regen_self = this.GetAbility().GetSpecialValueFor("mana_regen")       
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MANA_REGEN_CONSTANT]
    }

    GetModifierConstantManaRegen(): number {
        if(this.GetParent()==this.GetCaster()){
            return this.regen_self
        }
        else{
            return this.regen_ally
        }
    }

}
