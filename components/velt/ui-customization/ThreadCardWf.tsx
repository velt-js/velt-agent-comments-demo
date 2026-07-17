import { VeltCommentDialogWireframe, VeltIf } from "@veltdev/react";
import {
  ResolveIcon,
  ReopenIcon,
  KebabIcon,
  PencilIcon,
  LinkIcon,
  TrashIcon,
} from "@/components/icons";

// Thread card wireframe — the per-comment row inside a dialog/sidebar thread.
// Ported from the altana-wireframes reference: avatar + rail line, header with
// name/time/edited/draft/unread, hover actions (resolve on the root comment +
// a kebab menu with Edit / Copy link / Delete), and the message body.
export function ThreadCardWf() {
  return (
    <VeltCommentDialogWireframe.ThreadCard>
      <div className="hw-comment">
        <div className="hw-comment-rail">
          <VeltCommentDialogWireframe.ThreadCard.Avatar />
          <span className="hw-rail-line" />
        </div>
        <div className="hw-comment-main">
          <div className="hw-comment-header">
            <VeltCommentDialogWireframe.ThreadCard.Name />
            <VeltCommentDialogWireframe.ThreadCard.Time />
            <VeltCommentDialogWireframe.ThreadCard.Edited />
            <VeltCommentDialogWireframe.ThreadCard.Draft />
            <VeltCommentDialogWireframe.ThreadCard.Unread />
            <div className="hw-comment-actions">
              <VeltIf condition="{i} === 0">
                <VeltCommentDialogWireframe.ResolveButton>
                  <span className="hw-icon-btn">
                    <ResolveIcon />
                  </span>
                </VeltCommentDialogWireframe.ResolveButton>
                <VeltCommentDialogWireframe.UnresolveButton>
                  <span className="hw-icon-btn">
                    <ReopenIcon />
                  </span>
                </VeltCommentDialogWireframe.UnresolveButton>
              </VeltIf>
              <VeltCommentDialogWireframe.ThreadCard.Options>
                <VeltCommentDialogWireframe.ThreadCard.Options.Trigger>
                  <span className="hw-icon-btn">
                    <KebabIcon />
                  </span>
                </VeltCommentDialogWireframe.ThreadCard.Options.Trigger>
                <VeltCommentDialogWireframe.ThreadCard.Options.Content>
                  <div className="hw-menu">
                    <VeltCommentDialogWireframe.ThreadCard.Options.Content.Edit>
                      <span className="hw-menu-row">
                        <PencilIcon />
                        <span>Edit</span>
                      </span>
                    </VeltCommentDialogWireframe.ThreadCard.Options.Content.Edit>
                    <VeltCommentDialogWireframe.CopyLink>
                      <span className="hw-menu-row">
                        <LinkIcon />
                        <span>Copy link</span>
                      </span>
                    </VeltCommentDialogWireframe.CopyLink>
                    <div className="hw-menu-divider" />
                    <VeltCommentDialogWireframe.ThreadCard.Options.Content.Delete>
                      <span className="hw-menu-row hw-menu-danger">
                        <TrashIcon />
                        <span>Delete</span>
                      </span>
                    </VeltCommentDialogWireframe.ThreadCard.Options.Content.Delete>
                  </div>
                </VeltCommentDialogWireframe.ThreadCard.Options.Content>
              </VeltCommentDialogWireframe.ThreadCard.Options>
            </div>
          </div>
          <VeltCommentDialogWireframe.ThreadCard.Message />
        </div>
      </div>
    </VeltCommentDialogWireframe.ThreadCard>
  );
}

export default ThreadCardWf;
