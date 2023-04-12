



import { BaseAbility, registerAbility } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";
import "modifier_sven_gods_strength_lua"
import "modifier_sven_gods_strength_child_lua"

@reloadable
@registerAbility()
class sven_gods_strength_lua extends BaseAbility{
    constructor(){
        //print("sven_gods_strength_lua constructor")
        super()
    }

    OnSpellStart(): void {
        print("sven_gods_strength_lua OnSpellStart")

        const  gods_strength_duration = this.GetSpecialValueFor("gods_strength_duration")

        this.GetCaster().AddNewModifier(this.GetCaster(), this, "modifier_sven_gods_strength_lua", {duration:gods_strength_duration})

        const nFXIndex = ParticleManager.CreateParticle("particles/units/heroes/hero_sven/sven_spell_gods_strength.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetCaster())

        ParticleManager.SetParticleControlEnt(nFXIndex, 1, this.GetCaster(), ParticleAttachment.ABSORIGIN_FOLLOW, "", this.GetCaster().GetOrigin(), true)
        ParticleManager.ReleaseParticleIndex(nFXIndex)

        EmitSoundOn("Hero_Sven.GodsStrength", this.GetCaster())

        this.GetCaster().StartGesture(GameActivity.DOTA_OVERRIDE_ABILITY_4)
    }
}