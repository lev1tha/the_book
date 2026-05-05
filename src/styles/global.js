const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --brand: #1a56db;
    --brand-d: #1447c0;
    --brand-l: #eff4ff;
    --red: #dc2626;
    --green: #16a34a;
    --amber: #d97706;
    --purple: #7c3aed;

    --ink: #0d1117;
    --ink2: #24292f;
    --ink3: #404652;
    --muted: #6b7280;
    --border: #e5e7eb;
    --border2: #d1d5db;
    --surface: #ffffff;
    --bg: #f3f4f6;
    --bg2: #f9fafb;
    --stripe: #f6f8fa;

    --font: 'Golos Text', sans-serif;
    --mono: 'JetBrains Mono', monospace;
    --radius: 10px;
    --shadow: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.05);
    --shadow-md: 0 4px 16px rgba(0,0,0,.09), 0 1px 3px rgba(0,0,0,.06);
    --shadow-lg: 0 10px 40px rgba(0,0,0,.13), 0 2px 8px rgba(0,0,0,.07);
  }

  html, body, #root { height: 100%; }
  body { font-family: var(--font); background: var(--bg); color: var(--ink2); -webkit-font-smoothing: antialiased; }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

  /* LAYOUT */
  .layout { display: flex; height: 100vh; overflow: hidden; }
  .main   { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
  .page   { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

  /* SIDEBAR */
  .sb        { width: 240px; min-width: 240px; background: var(--ink); display: flex; flex-direction: column; border-right: 1px solid #1f2937; }
  .sb-logo   { padding: 20px 18px; border-bottom: 1px solid #1f2937; display: flex; align-items: center; gap: 12px; }
  .sb-mark   { width: 38px; height: 38px; border-radius: 9px; background: var(--brand); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .sb-title  { color: #f9fafb; font-size: 14px; font-weight: 700; line-height: 1.2; }
  .sb-sub    { color: #6b7280; font-size: 11px; font-family: var(--mono); margin-top: 2px; }
  .sb-nav    { flex: 1; padding: 14px 10px; display: flex; flex-direction: column; gap: 1px; }
  .sb-section{ color: #4b5563; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; padding: 10px 10px 6px; font-family: var(--mono); }
  .sb-item   { display: flex; align-items: center; gap: 9px; padding: 9px 12px; border-radius: 8px; color: #9ca3af; font-size: 13.5px; font-weight: 500; cursor: pointer; border: none; background: none; width: 100%; text-align: left; transition: all .15s; }
  .sb-item:hover   { background: #ffffff0d; color: #f3f4f6; }
  .sb-item.active  { background: #1d3461; color: #93c5fd; }
  .sb-item .sb-ic  { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 6px; flex-shrink: 0; }
  .sb-item.active .sb-ic { background: rgba(59,130,246,.2); }
  .sb-badge  { margin-left: auto; font-size: 10px; font-weight: 700; font-family: var(--mono); padding: 1px 7px; border-radius: 20px; background: #ef4444; color: #fff; }
  .sb-foot   { padding: 14px 10px; border-top: 1px solid #1f2937; }
  .sb-user   { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; }
  .sb-av     { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #1d4ed8); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: 700; font-family: var(--mono); flex-shrink: 0; }
  .sb-uname  { color: #f3f4f6; font-size: 13px; font-weight: 600; }
  .sb-urole  { color: #6b7280; font-size: 10.5px; font-family: var(--mono); margin-top: 1px; }

  /* TOPBAR */
  .topbar    { height: 56px; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; flex-shrink: 0; gap: 12px; }
  .tb-left   { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .tb-crumb  { color: var(--muted); font-size: 13px; flex-shrink: 0; }
  .tb-sep    { color: var(--border2); flex-shrink: 0; }
  .tb-title  { font-size: 15px; font-weight: 700; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tb-right  { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .tb-icon   { width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border); background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--muted); position: relative; transition: all .15s; }
  .tb-icon:hover { background: var(--bg2); color: var(--ink2); }
  .tb-ndot   { position: absolute; top: 7px; right: 7px; width: 7px; height: 7px; border-radius: 50%; background: #ef4444; border: 1.5px solid #fff; }
  .tb-btn    { display: flex; align-items: center; gap: 6px; background: var(--brand); color: #fff; border: none; border-radius: 8px; padding: 0 16px; height: 36px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: var(--font); transition: background .15s; white-space: nowrap; }
  .tb-btn:hover { background: var(--brand-d); }
  .tb-today  { font-size: 12px; font-family: var(--mono); color: var(--muted); white-space: nowrap; }

  /* STATS */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .stat-card  { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 20px; transition: box-shadow .2s; }
  .stat-card:hover { box-shadow: var(--shadow-md); }
  .stat-top   { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .stat-lbl   { font-size: 12.5px; color: var(--muted); font-weight: 500; }
  .stat-ic    { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .stat-val   { font-size: 30px; font-weight: 800; color: var(--ink); font-family: var(--mono); line-height: 1; }
  .stat-foot  { display: flex; align-items: center; gap: 4px; margin-top: 8px; font-size: 12px; color: var(--muted); font-family: var(--mono); }
  .stat-up    { color: #16a34a; }

  /* CARD */
  .card       { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); }
  .card-head  { padding: 14px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .card-title { font-size: 14.5px; font-weight: 700; color: var(--ink); }
  .card-sub   { font-size: 12px; color: var(--muted); font-family: var(--mono); margin-top: 2px; }
  .card-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

  /* SEARCH / SELECT */
  .srch-wrap { position: relative; }
  .srch-ico  { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
  .srch-inp  { padding: 7px 12px 7px 32px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; color: var(--ink2); outline: none; width: 220px; font-family: var(--font); background: var(--bg2); transition: all .15s; }
  .srch-inp:focus { border-color: var(--brand); background: #fff; box-shadow: 0 0 0 3px #1a56db18; }
  .sel  { padding: 7px 10px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; color: var(--ink2); background: #fff; outline: none; cursor: pointer; font-family: var(--font); }
  .sel:focus { border-color: var(--brand); }

  /* TABLE */
  .tscroll  { overflow-x: auto; }
  table     { width: 100%; border-collapse: collapse; }
  thead th  { padding: 9px 16px; text-align: left; font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .06em; border-bottom: 1px solid var(--border); background: var(--stripe); white-space: nowrap; font-family: var(--mono); }
  tbody td  { padding: 12px 16px; font-size: 13.5px; color: var(--ink3); border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover td { background: #fafbfc; }
  .tfoot    { padding: 10px 20px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--stripe); }
  .tcnt     { font-size: 12px; color: var(--muted); font-family: var(--mono); }

  /* PATIENT CELL */
  .pt-cell  { display: flex; align-items: center; gap: 10px; }
  .pt-av    { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; }
  .av-m     { background: #dbeafe; color: #1d4ed8; }
  .av-f     { background: #fce7f3; color: #be185d; }
  .pt-name  { font-weight: 600; color: var(--ink2); font-size: 13.5px; line-height: 1.2; }
  .pt-meta  { font-size: 11px; color: var(--muted); font-family: var(--mono); }

  /* BADGE */
  .badge   { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px 3px 7px; border-radius: 20px; font-size: 11.5px; font-weight: 600; }
  .bdot    { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .dept-tag { background: var(--brand-l); color: var(--brand); padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; white-space: nowrap; }

  /* ACTION BUTTONS */
  .acts  { display: flex; align-items: center; gap: 4px; }
  .abt   { width: 30px; height: 30px; border-radius: 7px; border: 1px solid var(--border); background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--muted); transition: all .15s; }
  .abt:hover       { background: var(--bg2); color: var(--ink2); }
  .abt.view:hover  { border-color: #bfdbfe; background: #eff6ff; color: var(--brand); }
  .abt.del:hover   { border-color: #fecaca; background: #fef2f2; color: #dc2626; }

  /* STATUS DROPDOWN */
  .status-wrap { position: relative; display: inline-flex; }
  .status-wrap .dropdown { position: absolute; top: calc(100% + 6px); left: 0; background: #fff; border: 1px solid var(--border); border-radius: 10px; box-shadow: var(--shadow-lg); z-index: 50; min-width: 170px; padding: 4px; }
  .status-opt  { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 7px; font-size: 13px; font-weight: 500; cursor: pointer; transition: background .12s; }
  .status-opt:hover { background: var(--bg2); }

  /* MODAL */
  .overlay  { position: fixed; inset: 0; background: rgba(13,17,23,.55); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); animation: fadein .15s; }
  @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
  .modal    { background: #fff; border-radius: 16px; width: 100%; max-width: 580px; box-shadow: var(--shadow-lg); overflow: hidden; max-height: 90vh; display: flex; flex-direction: column; animation: slideup .18s ease; }
  @keyframes slideup { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .mhd      { padding: 20px 24px; background: var(--ink); color: #fff; flex-shrink: 0; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .mhd-info { display: flex; align-items: center; gap: 14px; }
  .mhd-av   { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 17px; flex-shrink: 0; }
  .mhd-av.m { background: #1d3461; color: #93c5fd; }
  .mhd-av.f { background: #4c1d4c; color: #f9a8d4; }
  .m-name   { font-size: 18px; font-weight: 700; }
  .m-id     { font-size: 11.5px; color: #9ca3af; font-family: var(--mono); margin-top: 3px; }
  .mclose   { background: none; border: none; color: #9ca3af; cursor: pointer; padding: 4px; border-radius: 6px; transition: all .15s; flex-shrink: 0; }
  .mclose:hover { color: #fff; background: rgba(255,255,255,.1); }
  .mbody    { padding: 22px 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 18px; }
  .m-section { }
  .m-sec-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); margin-bottom: 12px; font-family: var(--mono); padding-bottom: 8px; border-bottom: 1px solid var(--border); }
  .m-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .m-label  { font-size: 11.5px; color: var(--muted); margin-bottom: 3px; }
  .m-value  { font-size: 14px; font-weight: 600; color: var(--ink2); }
  .m-full   { grid-column: span 2; }
  .m-complaint { background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; font-size: 13.5px; color: var(--ink3); line-height: 1.6; }
  .m-row-icon { display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--ink3); }
  .m-row-icon svg { color: var(--muted); flex-shrink: 0; }
  .m-foot   { padding: 14px 24px; border-top: 1px solid var(--border); background: var(--stripe); display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex-shrink: 0; }

  /* REGISTER */
  .reg-outer { flex: 1; overflow-y: auto; padding: 24px; display: flex; justify-content: center; align-items: flex-start; }
  .reg-wrap  { width: 100%; max-width: 900px; }
  .reg-card  { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; box-shadow: var(--shadow-md); }
  .reg-hd    { background: linear-gradient(120deg, #1a3a6c 0%, #1a56db 100%); padding: 24px 28px; color: #fff; }
  .reg-hdtit { font-size: 22px; font-weight: 800; }
  .reg-hdsub { color: #93c5fd; font-size: 12.5px; font-family: var(--mono); margin-top: 4px; }
  .reg-progress { background: #f1f5f9; padding: 16px 28px; border-bottom: 1px solid var(--border); }
  .steps     { display: flex; align-items: center; }
  .step-item { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
  .step-circ { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; border: 2.5px solid; font-family: var(--mono); transition: all .25s; }
  .step-circ.done { background: var(--brand); border-color: var(--brand); color: #fff; }
  .step-circ.curr { background: #fff; border-color: var(--brand); color: var(--brand); }
  .step-circ.next { background: #fff; border-color: var(--border2); color: var(--muted); }
  .step-lbl  { font-size: 11px; margin-top: 4px; color: var(--muted); font-weight: 500; white-space: nowrap; }
  .step-lbl.curr { color: var(--brand); font-weight: 600; }
  .step-line { flex: 1; height: 2.5px; margin: 0 8px 20px; border-radius: 2px; transition: background .25s; }
  .step-line.done { background: var(--brand); }
  .step-line.next { background: var(--border); }
  .reg-body  { padding: 28px; }
  .reg-stit  { font-size: 17px; font-weight: 700; color: var(--ink); display: flex; align-items: center; gap: 8px; margin-bottom: 22px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }

  /* FORM */
  .fgrid3   { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 14px; }
  .fgrid2   { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 14px; }
  .fgroup   { display: flex; flex-direction: column; }
  .flbl     { font-size: 13px; font-weight: 500; color: var(--ink3); margin-bottom: 5px; }
  .req      { color: #ef4444; }
  .finp, .fsel, .ftxt { padding: 9px 12px; border: 1.5px solid var(--border); border-radius: 8px; font-size: 14px; color: var(--ink2); outline: none; font-family: var(--font); transition: all .15s; background: #fff; width: 100%; }
  .finp:focus, .fsel:focus, .ftxt:focus { border-color: var(--brand); box-shadow: 0 0 0 3px #1a56db18; }
  .finp.err, .fsel.err { border-color: #ef4444; background: #fff9f9; }
  .finp:disabled, .fsel:disabled { background: var(--bg2); color: var(--muted); cursor: not-allowed; }
  .ftxt     { resize: vertical; min-height: 80px; }
  .ferr     { color: #ef4444; font-size: 11.5px; margin-top: 3px; }

  /* CONFIRM */
  .confirm-box   { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 20px; }
  .confirm-sec   { padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid var(--border); }
  .confirm-sec:last-child { border: none; padding: 0; margin: 0; }
  .confirm-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); margin-bottom: 10px; font-family: var(--mono); }
  .confirm-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
  .cl { font-size: 13px; color: var(--muted); }
  .cv { font-size: 13px; font-weight: 600; color: var(--ink2); }
  .alert-info { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px 14px; display: flex; gap: 10px; margin-bottom: 14px; }
  .alert-txt  { font-size: 13px; color: #1e40af; line-height: 1.5; }
  .dup-warn   { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px 14px; display: flex; gap: 10px; margin-bottom: 14px; }
  .dup-txt    { font-size: 13px; color: #92400e; line-height: 1.5; }

  /* BUTTONS */
  .btnrow      { display: flex; align-items: center; justify-content: space-between; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border); gap: 10px; }
  .btn         { padding: 9px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; border: none; cursor: pointer; font-family: var(--font); transition: all .15s; display: flex; align-items: center; gap: 7px; }
  .btn-ghost   { background: transparent; color: var(--ink3); border: 1px solid var(--border); }
  .btn-ghost:hover   { background: var(--bg2); }
  .btn-primary { background: var(--brand); color: #fff; margin-left: auto; }
  .btn-primary:hover { background: var(--brand-d); }
  .btn-success { background: #16a34a; color: #fff; margin-left: auto; }
  .btn-success:hover { background: #15803d; }
  .btn-outline { background: #fff; color: var(--brand); border: 1.5px solid var(--brand); }
  .btn-outline:hover { background: var(--brand-l); }

  /* SUCCESS / TICKET */
  .succ-outer { flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .succ-card  { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 44px 36px; text-align: center; max-width: 460px; width: 100%; box-shadow: var(--shadow-md); }
  .succ-icon  { width: 72px; height: 72px; border-radius: 50%; background: #dcfce7; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
  .succ-h     { font-size: 22px; font-weight: 800; color: var(--ink); margin-bottom: 8px; }
  .succ-p     { font-size: 13.5px; color: var(--muted); margin-bottom: 20px; line-height: 1.6; }
  .ticket     { background: var(--ink); color: #fff; border-radius: 12px; padding: 20px 24px; text-align: left; margin-bottom: 20px; }
  .ticket-num { font-family: var(--mono); font-size: 40px; font-weight: 900; color: #93c5fd; text-align: center; display: block; margin-bottom: 12px; }
  .ticket-row { display: flex; justify-content: space-between; font-size: 13px; padding: 5px 0; border-bottom: 1px solid #1f2937; }
  .ticket-row:last-child { border: none; }
  .ticket-lbl { color: #9ca3af; }
  .ticket-val { color: #f3f4f6; font-weight: 600; }

  /* QUEUE */
  .queue-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .queue-card  { background: #fff; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); }
  .qcard-hd    { padding: 12px 16px; background: var(--ink); color: #fff; display: flex; align-items: center; justify-content: space-between; }
  .qcard-dept  { font-size: 14px; font-weight: 700; }
  .qcard-cnt   { font-size: 12px; font-family: var(--mono); color: #9ca3af; }
  .qitem       { display: flex; align-items: center; gap: 12px; padding: 11px 16px; border-bottom: 1px solid #f3f4f6; transition: background .12s; }
  .qitem:last-child { border: none; }
  .qitem.in_progress { background: #faf5ff; }
  .qnum        { width: 32px; height: 32px; border-radius: 8px; background: var(--brand-l); color: var(--brand); font-family: var(--mono); font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .qname       { font-size: 13.5px; font-weight: 600; color: var(--ink2); }
  .qtime       { font-size: 11.5px; color: var(--muted); font-family: var(--mono); margin-top: 2px; }
  .qbadge      { margin-left: auto; flex-shrink: 0; }

  /* PATIENTS CARD LIST */
  .patient-list { display: flex; flex-direction: column; gap: 10px; }
  .p-card       { background: #fff; border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 20px; display: flex; align-items: center; gap: 16px; transition: box-shadow .18s; }
  .p-card:hover { box-shadow: var(--shadow-md); }
  .p-card-info  { flex: 1; min-width: 0; }
  .p-card-name  { font-size: 15px; font-weight: 700; color: var(--ink2); }
  .p-card-meta  { font-size: 12.5px; color: var(--muted); font-family: var(--mono); margin-top: 3px; display: flex; flex-wrap: wrap; gap: 10px; }
  .p-card-appt  { margin-left: auto; text-align: right; flex-shrink: 0; }
  .p-card-date  { font-size: 13px; font-family: var(--mono); font-weight: 600; color: var(--ink3); }
  .p-card-dept  { font-size: 12px; color: var(--muted); margin-top: 3px; }

  @media (max-width: 960px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .queue-grid { grid-template-columns: 1fr; }
    .fgrid3, .fgrid2 { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 640px) {
    .sb { width: 56px; min-width: 56px; }
    .sb-title, .sb-sub, .sb-item span:not(.sb-badge), .sb-section, .sb-uname, .sb-urole { display: none; }
    .sb-item .sb-ic { width: 32px; height: 32px; }
    .sb-logo { padding: 14px 12px; justify-content: center; }
    .sb-item { padding: 10px 12px; justify-content: center; }
    .fgrid3, .fgrid2 { grid-template-columns: 1fr; }
    .m-grid { grid-template-columns: 1fr; }
    .m-full { grid-column: span 1; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .confirm-grid { grid-template-columns: 1fr; }
  }
`;

export default CSS;
