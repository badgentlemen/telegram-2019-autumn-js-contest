import BaseComponent from "../base.component";
import {createElement} from "../../lib";
import {TelegramAttrKeys} from "../../tl_utils";


export default class PeerPhoto extends BaseComponent {
    constructor(options = {}) {
        super(options);

        this.photoNodeImage = null;

        this.classes = {
            online: 'ui-dialog__online'
        }

        this.node = createElement(
            "div", {
                class: `ui-peer__photo ui-user__bgcolor_${options.num || 1}`
            }
        );

        if (options.hasOwnProperty(TelegramAttrKeys.peerInitials)) {
            this.setInitials(options[TelegramAttrKeys.peerInitials]);
        }

        this.photoNodeImage = createElement("img", {
            class: "ui-dialog__photo"
        });

        this.node.appendChild(this.photoNodeImage);
    }

    setOnline(online) {
        if (!online) {
            this.node.classList.remove(this.classes.online);
        } else {
            this.node.classList.add(this.classes.online);
        }
    }

    setInitials(initials) {
        this.node.setAttribute(
            TelegramAttrKeys.peerInitials, initials
        );
    }

    setImageSrc(source) {
        this.photoNodeImage.src = source;
    }

}