



import { BaseAbility, registerAbility } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";
import "modifier_tiny_toss_lua";


@reloadable
@registerAbility()
class tiny_toss_lua extends BaseAbility{
    constructor(){
        //print("tiny_toss_lua constructor")
        super()
    }

    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius")
    }

    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if(this.GetCaster() == target)
        {
            return UnitFilterResult.FAIL_CUSTOM
        }
        else
        {
            return UnitFilterResult.SUCCESS
        }
    }

    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        if(this.GetCaster()==target){
            return "#dota_hud_error_cant_cast_on_self"
        }
        else{
            return "#dota_hud_error_nothing_to_toss"
        }
    }

    FindEnemies():CDOTA_BaseNPC{
        const caster = this.GetCaster()
        const radius = this.GetSpecialValueFor("grab_radius")

        const units = FindUnitsInRadius(
            caster.GetTeamNumber(),
            caster.GetOrigin(),
            null,
            radius,
            UnitTargetTeam.BOTH,
            UnitTargetType.HERO+UnitTargetType.BASIC,
            UnitTargetFlags.NONE,
            FindOrder.CLOSEST,
            false
        )

        let target = null

        for(let i=0; i<units.length; ++i)
        {
            let unit = units[i]
            const filter1 = (unit!=caster)&&(!unit.IsAncient())&&(!unit.FindModifierByName("modifier_tiny_toss_lua"))
            const filter2 = (unit.GetTeamNumber()==caster.GetTeamNumber())||(!unit.IsInvisible())
            if(filter1&&filter2)
            {
                target = unit
                break
            }
        }

        return target
    }

    OnAbilityPhaseInterrupted(): void {
        
    }

    OnAbilityPhaseStart(): boolean {
        if(this.FindEnemies()){
            print("FindEnemies success")
            return true
        }
        else{
            print("FindEnemies fail")
            return false
        }
    }

    OnSpellStart(): void {
        const caster = this.GetCaster()
        const target = this.GetCursorTarget()
        const victim = this.FindEnemies()

        //print("entindex:" + target.entindex)
        victim.AddNewModifier(
            caster,
            this,
            "modifier_tiny_toss_lua",
            {
                target : target.entindex()
            }
        )
    }

}