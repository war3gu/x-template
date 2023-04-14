

import { BaseItem, registerAbility } from "../../utils/dota_ts_adapter";
import { reloadable } from "../../utils/tstl-utils";


@reloadable
@registerAbility()
class item_blink_staff extends BaseItem{
    constructor(){
        //print("item_blink_staff constructor")
        super()
    }

    GetBehavior(): AbilityBehavior | Uint64 {
        return AbilityBehavior.POINT+AbilityBehavior.UNIT_TARGET+AbilityBehavior.ROOT_DISABLES
    }

    GetManaCost(level: number): number {
        return 50
    }

    GetCooldown(level: number): number {
        return 5
    }

    OnSpellStart(): void {
        const hCaster = this.GetCaster()
        let hTarget:CDOTA_BaseNPC = this.GetCursorTarget()

        let vPoint = this.GetCursorPosition()
        const vOrigin = hCaster.GetAbsOrigin()
        const nMaxBlink = 1200
        const nClamp = 960

        ProjectileManager.ProjectileDodge(hCaster)
        ParticleManager.CreateParticle("particles/items_fx/blink_dagger_start.vpcf", ParticleAttachment.ABSORIGIN, hCaster)
        hCaster.EmitSound("DOTA_Item.BlinkDagger.Activate")
        const vDiff = vPoint.__sub(vOrigin)

        if(vDiff.Length2D() > nMaxBlink)
        {
            let nor = vDiff.Normalized().__mul(nClamp)
            
            vPoint = vOrigin.__add(nor)
        }

        hCaster.SetAbsOrigin(vPoint)

        FindClearSpaceForUnit(hCaster, vPoint, false)

        ParticleManager.CreateParticle("particles/items_fx/blink_dagger_end.vpcf",ParticleAttachment.ABSORIGIN,hCaster)

    }
}