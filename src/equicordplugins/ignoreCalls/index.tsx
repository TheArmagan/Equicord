/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { EquicordDevs } from "@utils/constants";
import definePlugin from "@utils/types";
import { FluxDispatcher, Menu, React, UserStore } from "@webpack/common";
import { Channel } from "discord-types/general";

const ignoredChannelIds = new Set<string>();

const ContextMenuPatch: NavContextMenuPatchCallback = (children, { channel }: { channel: Channel; }) => {
    if (!channel || (!channel.isDM() && !channel.isGroupDM())) return;

    const [checked, setChecked] = React.useState(ignoredChannelIds.has(channel.id));

    children.push(
        <Menu.MenuSeparator />,
        <Menu.MenuCheckboxItem
            id="ic-ignore-calls"
            label="Ignore Calls"
            checked={checked}
            action={() => {
                if (checked)
                    ignoredChannelIds.delete(channel.id);
                else
                    ignoredChannelIds.add(channel.id);


                setChecked(!checked);
            }}
        ></Menu.MenuCheckboxItem>
    );
};


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
                    region
                });
            }
        }
    },
    contextMenus: {
        "user-context": ContextMenuPatch,
        "gdm-context": ContextMenuPatch,
    }
});
