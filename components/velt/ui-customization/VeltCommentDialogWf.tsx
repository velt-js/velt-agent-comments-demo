"use client";

import {
  VeltButtonWireframe,
  VeltCommentDialogWireframe,
} from "@veltdev/react";
import { ReplyArrowIcon } from "@/components/icons";
import { ThreadCardWf } from "./ThreadCardWf";

// Comment dialog wireframe — the card chrome shared by the floating dialog and
// the sidebar threads. Ported from altana-wireframes: a body of thread cards, a
// "Show N replies…" expander, a static "↩ Reply" toggle, and a composer with an
// avatar, input, Cancel escape hatch, and the SDK submit button.
export function VeltCommentDialogWf() {
  return (
    <VeltCommentDialogWireframe>
      <div className="hw-card">
        <VeltCommentDialogWireframe.VisibilityBanner />
        <VeltCommentDialogWireframe.Body>
          <VeltCommentDialogWireframe.Threads>
            <ThreadCardWf />
          </VeltCommentDialogWireframe.Threads>
          <VeltCommentDialogWireframe.MoreReply>
            <span className="hw-more-reply">
              Show <VeltCommentDialogWireframe.MoreReply.Count />{" "}
              <VeltCommentDialogWireframe.MoreReply.Text />
            </span>
          </VeltCommentDialogWireframe.MoreReply>
          <VeltCommentDialogWireframe.ToggleReply>
            <div className="hw-reply">
              <ReplyArrowIcon />
              <span>Reply</span>
            </div>
          </VeltCommentDialogWireframe.ToggleReply>
        </VeltCommentDialogWireframe.Body>
        <VeltCommentDialogWireframe.Composer>
          <div className="hw-composer">
            <div className="hw-composer-row">
              <VeltCommentDialogWireframe.Composer.Avatar />
              <VeltCommentDialogWireframe.Composer.Input />
            </div>
            <div className="hw-composer-actions">
              <VeltButtonWireframe id="hw-cancel" type="button">
                <span className="hw-composer-cancel">Cancel</span>
              </VeltButtonWireframe>
              <VeltCommentDialogWireframe.Composer.ActionButton type="submit" />
            </div>
          </div>
        </VeltCommentDialogWireframe.Composer>
      </div>
    </VeltCommentDialogWireframe>
  );
}

export default VeltCommentDialogWf;
