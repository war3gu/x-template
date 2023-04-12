import { reloadable } from '../utils/tstl-utils';
import { Debug } from './Debug';
import { GameConfig } from './GameConfig';
import { XNetTable } from './xnet-table';

declare global {
    interface CDOTAGameRules {
        // 声明所有的GameRules模块，这个主要是为了方便其他地方的引用（保证单例模式）
        XNetTable: XNetTable;
    }
}

/**
 * 这个方法会在game_mode实体生成之后调用，且仅调用一次
 * 因此在这里作为单例模式使用
 **/
export function ActivateModules() {
    if (GameRules.XNetTable == null) {
        // 初始化所有的GameRules模块
        GameRules.XNetTable = new XNetTable();
        // 如果某个模块不需要在其他地方使用，那么直接在这里使用即可
        new GameConfig();
        // 初始化测试模块xD
        new Debug();

        ListenToGameEvent("npc_spawned", (event)=>{
            print("nothing")
            const hero = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC
            
            if (hero.IsHero()){

                print("IsHero")
                Timers.CreateTimer(1,()=>{
                    const item = CreateItem("item_circlet", hero.GetPlayerOwner(), hero.GetPlayerOwner())
                    CreateItemOnPositionSync(Vector(0,0,0), item)

                    //hero.SetModelScale(3)

                    const id1 = ParticleManager.CreateParticle("particles/units/heroes/hero_bounty_hunter/bounty_hunter_shuriken_toss_main.vpcf", ParticleAttachment.INVALID, hero)
                    ParticleManager.SetParticleControlEnt(id1,3,hero,ParticleAttachment.POINT_FOLLOW,"attach_attack3",Vector(),false)
                    const id2 = ParticleManager.CreateParticle("particles/units/heroes/hero_bounty_hunter/bounty_hunter_shuriken_toss_main.vpcf", ParticleAttachment.INVALID, hero)
                    ParticleManager.SetParticleControlEnt(id2,3,hero,ParticleAttachment.POINT_FOLLOW,"attach_attack2",Vector(),false)

                    const id3 = ParticleManager.CreateParticle("particles/units/heroes/hero_bounty_hunter/bounty_hunter_shuriken_toss_main.vpcf", ParticleAttachment.INVALID, hero)
                    ParticleManager.SetParticleControlEnt(id3,3,hero,ParticleAttachment.OVERHEAD_FOLLOW,"",Vector(),false)

                    Timers.CreateTimer(5,()=>{
                        ParticleManager.DestroyParticle(id1, false)
                        ParticleManager.DestroyParticle(id2, false)
                        ParticleManager.DestroyParticle(id3, true)
                    })
                })

                hero.HeroLevelUp(true)
                hero.HeroLevelUp(true)
                hero.HeroLevelUp(true)
                hero.HeroLevelUp(true)
                hero.HeroLevelUp(true)
                hero.HeroLevelUp(true)
                hero.HeroLevelUp(true)
                hero.HeroLevelUp(true)
                hero.HeroLevelUp(true)
            }


        },null)
    }

}
