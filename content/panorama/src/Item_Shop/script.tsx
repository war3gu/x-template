

import React, {useState} from 'react';
import { render, useGameEvent } from 'react-panorama-x'

function KDA() {
    const [kills, setKills] = useState(() => Game.GetLocalPlayerInfo().player_kills);
    const [deaths, setDeaths] = useState(() => Game.GetLocalPlayerInfo().player_deaths);
    const [assists, setAssists] = useState(() => Game.GetLocalPlayerInfo().player_assists);
    useGameEvent('dota_player_kill', () => {
      const playerInfo = Game.GetLocalPlayerInfo();
      setKills(playerInfo.player_kills);
      setDeaths(playerInfo.player_deaths);
      setAssists(playerInfo.player_assists);
    }, []);
  
    return <Label style={{ color: 'white' }} text={`KDA: ${kills}/${deaths}/${assists}`} />;
  }
  
  render(<KDA />, $.GetContextPanel());