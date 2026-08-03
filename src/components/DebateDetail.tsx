import React, { useState } from 'react';
import { ArrowLeft, Share2, Calendar, Lock, Unlock, Trash2 } from 'lucide-react';
import type { Debate, Argument, Rebuttal, VoteRecord, Source } from '../types';
import { ArgumentCard } from './ArgumentCard';
import { ArgumentForm } from './ArgumentForm';
import { RebuttalDrawer } from './RebuttalDrawer';
import { ConfirmModal } from './ConfirmModal';

interface DebateDetailProps {
  debate: Debate;
  onBack: () => void;
  onShare: () => void;
  isExpired: boolean;
  formatExpiration: (debate: Debate) => string;
  proArguments: Argument[];
  conArguments: Argument[];
  userVotes: Record<string, VoteRecord>;
  onVote: (argumentId: string, type: "up" | "down", rebuttalId?: string) => void;
  openRebuttalArgId: string | null;
  setOpenRebuttalArgId: (id: string | null) => void;
  rebuttalsMap: Record<string, Rebuttal[]>;
  setRebuttalsMap: React.Dispatch<React.SetStateAction<Record<string, Rebuttal[]>>>;
  currentUserId?: string;
  onDeleteDebate?: (debate: Debate) => void;
  onDeleteArgument?: (arg: Argument) => void;
  
  // Pro Arg Form state
  proArgText: string;
  setProArgText: (val: string) => void;
  proSources: Source[];
  onAddProSource: () => void;
  onUpdateProSource: (index: number, field: "title" | "url", val: string) => void;
  onRemoveProSource: (index: number) => void;
  isSubmittingPro: boolean;
  proError: string;
  onSubmitPro: () => void;

  // Con Arg Form state
  conArgText: string;
  setConArgText: (val: string) => void;
  conSources: Source[];
  onAddConSource: () => void;
  onUpdateConSource: (index: number, field: "title" | "url", val: string) => void;
  onRemoveConSource: (index: number) => void;
  isSubmittingCon: boolean;
  conError: string;
  onSubmitCon: () => void;

  // Rebuttal Form state
  rebuttalInput: string;
  setRebuttalInput: (val: string) => void;
  isSubmittingRebuttal: boolean;
  rebuttalError: string;
  onSubmitRebuttal: (e: React.FormEvent) => void;
}

export const DebateDetail: React.FC<DebateDetailProps> = ({
  debate,
  onBack,
  onShare,
  isExpired,
  formatExpiration,
  proArguments,
  conArguments,
  userVotes,
  onVote,
  openRebuttalArgId,
  setOpenRebuttalArgId,
  rebuttalsMap,
  setRebuttalsMap,
  currentUserId,
  onDeleteDebate,
  onDeleteArgument,
  proArgText,
  setProArgText,
  proSources,
  onAddProSource,
  onUpdateProSource,
  onRemoveProSource,
  isSubmittingPro,
  proError,
  onSubmitPro,
  conArgText,
  setConArgText,
  conSources,
  onAddConSource,
  onUpdateConSource,
  onRemoveConSource,
  isSubmittingCon,
  conError,
  onSubmitCon,
  rebuttalInput,
  setRebuttalInput,
  isSubmittingRebuttal,
  rebuttalError,
  onSubmitRebuttal,
}) => {
  const [isConfirmDeleteDebateOpen, setIsConfirmDeleteDebateOpen] = useState(false);
  const isLocked = isExpired || debate.isLocked;
  const isCreator = Boolean(currentUserId && currentUserId === debate.creatorId);

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Navigation & Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onBack}
          className="btn btn-sm btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={16} /> Back to Debate Registry
        </button>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {isCreator && onDeleteDebate && (
            <button
              onClick={() => setIsConfirmDeleteDebateOpen(true)}
              className="btn btn-sm btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-danger)', border: '1px solid var(--color-border)' }}
            >
              <Trash2 size={15} /> Delete Debate
            </button>
          )}

          <button
            onClick={onShare}
            className="btn btn-sm btn-ghost"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--color-border)' }}
          >
            <Share2 size={15} /> Share Debate
          </button>
        </div>
      </div>

      {/* Debate Header Card */}
      <div className="card card-accent" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span className="badge" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
            {debate.category}
          </span>
          
          <span className="meta" style={{ color: 'var(--color-fg-muted)' }}>
            Created by <strong>{debate.creatorName || "Unknown"}</strong>
          </span>
        </div>

        <h2 style={{ fontSize: '2rem', textTransform: 'none', letterSpacing: 'normal', margin: '0.75rem 0 0.5rem 0' }}>
          {debate.title}
        </h2>

        {debate.description && (
          <p style={{
            fontSize: '1rem',
            lineHeight: 1.5,
            color: '#475569',
            marginBottom: '1rem',
            marginTop: 0
          }}>
            {debate.description}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} />
            <span className="meta" style={{ fontWeight: 500 }}>
              Duration: {debate.expirationTime ? `Expires ${formatExpiration(debate)}` : "No Expiration (Unlimited)"}
            </span>
          </div>

          <span className="meta" style={{
            color: isLocked ? 'var(--color-danger)' : 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontWeight: 600
          }}>
            {isLocked ? (
              <>
                <Lock size={14} /> Topic Locked
              </>
            ) : (
              <>
                <Unlock size={14} /> Open for submissions
              </>
            )}
          </span>
        </div>
      </div>

      {/* Two Column Layout: Pro vs Con */}
      <div className="pro-con-grid">
        
        {/* PRO Column */}
        <div className="pro-con-column" style={{ borderRight: '1px solid var(--color-border)', paddingRight: '2rem' }}>
          <h3 style={{
            color: 'var(--color-primary)',
            fontSize: '1.5rem',
            marginBottom: '1.25rem',
            paddingBottom: '0.5rem',
            borderBottom: '3px solid var(--color-primary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Pro Arguments</span>
            <span className="meta">{proArguments.length}</span>
          </h3>

          {!isLocked && (
            <ArgumentForm 
              side="pro"
              text={proArgText}
              setText={setProArgText}
              sources={proSources}
              onAddSource={onAddProSource}
              onUpdateSource={onUpdateProSource}
              onRemoveSource={onRemoveProSource}
              isSubmitting={isSubmittingPro}
              error={proError}
              onSubmit={onSubmitPro}
            />
          )}

          {/* Arguments List Pro */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {proArguments.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: 'var(--color-fg-muted)' }}>No supporting arguments yet.</p>
            ) : (
              proArguments.map((arg) => (
                <ArgumentCard 
                  key={arg.id} 
                  arg={arg} 
                  onVote={(type) => onVote(arg.id, type)}
                  userVote={userVotes[arg.id]}
                  isExpired={isLocked}
                  onExpandRebuttals={() => {
                    setOpenRebuttalArgId(openRebuttalArgId === arg.id ? null : arg.id);
                    setRebuttalsMap(prev => ({ ...prev, [arg.id]: prev[arg.id] || [] }));
                  }}
                  isRebuttalsOpen={openRebuttalArgId === arg.id}
                  currentUserId={currentUserId}
                  onDelete={onDeleteArgument}
                />
              ))
            )}
          </div>
        </div>

        {/* CON Column */}
        <div>
          <h3 style={{
            color: 'var(--color-danger)',
            fontSize: '1.5rem',
            marginBottom: '1.25rem',
            paddingBottom: '0.5rem',
            borderBottom: '3px solid var(--color-danger)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Con Arguments</span>
            <span className="meta">{conArguments.length}</span>
          </h3>

          {!isLocked && (
            <ArgumentForm 
              side="con"
              text={conArgText}
              setText={setConArgText}
              sources={conSources}
              onAddSource={onAddConSource}
              onUpdateSource={onUpdateConSource}
              onRemoveSource={onRemoveConSource}
              isSubmitting={isSubmittingCon}
              error={conError}
              onSubmit={onSubmitCon}
            />
          )}

          {/* Arguments List Con */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {conArguments.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: 'var(--color-fg-muted)' }}>No opposing arguments yet.</p>
            ) : (
              conArguments.map((arg) => (
                <ArgumentCard 
                  key={arg.id} 
                  arg={arg} 
                  onVote={(type) => onVote(arg.id, type)}
                  userVote={userVotes[arg.id]}
                  isExpired={isLocked}
                  onExpandRebuttals={() => {
                    setOpenRebuttalArgId(openRebuttalArgId === arg.id ? null : arg.id);
                    setRebuttalsMap(prev => ({ ...prev, [arg.id]: prev[arg.id] || [] }));
                  }}
                  isRebuttalsOpen={openRebuttalArgId === arg.id}
                  currentUserId={currentUserId}
                  onDelete={onDeleteArgument}
                />
              ))
            )}
          </div>
        </div>

      </div>

      {/* Shared Rebuttals Section */}
      {openRebuttalArgId && (
        <RebuttalDrawer 
          rebuttals={rebuttalsMap[openRebuttalArgId] || []}
          userVotes={userVotes}
          isLocked={isLocked}
          onClose={() => setOpenRebuttalArgId(null)}
          onVote={(rebuttalId, type) => onVote(openRebuttalArgId, type, rebuttalId)}
          rebuttalInput={rebuttalInput}
          setRebuttalInput={setRebuttalInput}
          isSubmitting={isSubmittingRebuttal}
          rebuttalError={rebuttalError}
          onSubmit={onSubmitRebuttal}
        />
      )}

      <ConfirmModal 
        isOpen={isConfirmDeleteDebateOpen}
        title="Delete Debate Topic"
        message={`Are you sure you want to delete "${debate.title}"? All arguments in this debate will be permanently removed.`}
        confirmText="Delete Debate"
        onConfirm={() => onDeleteDebate && onDeleteDebate(debate)}
        onClose={() => setIsConfirmDeleteDebateOpen(false)}
      />

    </section>
  );
};
