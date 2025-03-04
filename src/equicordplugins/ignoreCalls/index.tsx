/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { EquicordDevs } from "@utils/constants";
import definePlugin from "@utils/types";
import { FluxDispatcher, UserStore } from "@webpack/common";

const ignoredChannelIds = new Set<string>();

// TODO: Implement context menus for toggle and DataStore for persistence

export default definePlugin({
    name: "IgnoreCalls",
    description: "Allows you to ignore calls from specific users or dm groups.",
    authors: [EquicordDevs.TheArmagan],
    flux: {
        async CALL_UPDATE({ channelId, ringing, messageId, region }: { channelId: string; ringing: string[]; messageId: string; region: string; }) {
            if (!ignoredChannelIds.has(channelId)) return;
            const currentUserId = UserStore.getCurrentUser().id;

            if (ringing.includes(currentUserId)) {
                return FluxDispatcher.dispatch({
                    type: "CALL_UPDATE",
                    channelId,
                    ringing: ringing.filter((id: string) => id !== currentUserId),
                    messageId,
                    region,
                });
            }
        }
    }
});
