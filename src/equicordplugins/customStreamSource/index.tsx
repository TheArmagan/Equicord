/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { EquicordDevs } from "@utils/constants";
import definePlugin from "@utils/types";


export default definePlugin({
    name: "CustomStreamSource",
    description: "Allows you to set a custom audio stream source for your streams.",
    authors: [EquicordDevs.TheArmagan],
    patches: [
        {
            find: "_onStreamDirectSource",
            replacement: {
                match: /this._onDirectorAction\([^}]+\}\)/,
                replace: "console.log('_onDirectorAction', arguments);this._onDirectorAction({type:s.A.STREAM,sourceId:t,audioSourceId:$self.getAudioSourceId(),sound:r})"
            }
        }
    ],
    getAudioSourceId() {
        // "Voicemeeter Out B1 (VB-Audio Voicemeeter VAIO)"
        // Vencord.Webpack.findStore("MediaEngineStore").getInputDevices()
        return "{0.0.1.00000000}.{246f5506-0815-4fb4-bc63-66121c511b30}";
    }
});
