#!/usr/bin/env python3
"""
build_viewer.py — builds bom_viewer.html cleanly from scratch.
No patches. No accumulated fixes. Single pass.
"""
import json, sys
from pathlib import Path
from collections import Counter

def load(path):
    with open(path) as f: return json.load(f)

def j(data):
    return json.dumps(data, ensure_ascii=False, separators=(',', ':'))

def build():
    eu   = load('/home/claude/eu_bom_3way.json')
    lh   = load('/home/claude/lh_bom_3way.json')
    ft10 = load('/home/claude/ft10_bom_3way.json')
    b150 = load('/home/claude/bom150_3way.json')
    val  = load('/home/claude/val_v3.json')
    comp = load('/home/claude/comp_3way.json')

    eu_pids   = set(r['partId'] for r in eu)
    lh_pids   = set(r['partId'] for r in lh)
    ft10_pids = set(r['partId'] for r in ft10)
    vc        = Counter(r['variant'] for r in b150)
    total     = len(b150)
    common_n  = vc.get('COMMON',0)
    eu_rh_n   = vc.get('EU_RH',0)
    lh32_n    = vc.get('LH_NA_32FT',0)
    lh10_n    = vc.get('LH_NA_10FT',0)
    lhboth_n  = vc.get('LH_NA_BOTH',0)
    pending_n = vc.get('PENDING_SME',0)

    FEAT = [
        {'family':'Region',      'values':['EU','NA'],                       'active':['EU','NA'],          'mandatory':True},
        {'family':'Orientation', 'values':['RH','LH'],                       'active':['RH','LH'],          'mandatory':True},
        {'family':'Length',      'values':['5Ft','6Ft','10Ft','15Ft','32Ft'],'active':['6Ft','10Ft','32Ft'],'mandatory':True},
        {'family':'Outfeed Type','values':['Intralox','SWM'],                'active':['Intralox'],         'mandatory':True},
        {'family':'Infeed',      'values':['Yes','No'],                      'active':['Yes'],              'mandatory':True},
        {'family':'Languages',   'values':['English','Spanish','French','Dutch'],'active':[],               'mandatory':True},
    ]

    INCL = [
        {'num':1,  'cond':'Region = EU AND Orientation = RH AND Length = 6Ft',              'id':'A00028615','name':'PLB_UNIVERSAL_ROBOTIC_LABELER_REV-D_6FT_RH_EU',      'boms':'6FT EU',            'conf':'HIGH'},
        {'num':2,  'cond':'Region = NA AND Orientation = LH AND Length = 32Ft',             'id':'A00024724','name':'PLB_UNIVERSAL_ROBOTIC_LABELER_REV-D_32FT_LH_NA',     'boms':'32FT LH',           'conf':'HIGH'},
        {'num':3,  'cond':'Region = NA AND Orientation = LH AND Length = 10Ft',             'id':'A00027124','name':'PLB_UNIVERSAL_ROBOTIC_LABELER_REV-D_10FT_LH_NA',     'boms':'10FT LH',           'conf':'HIGH'},
        {'num':4,  'cond':'Region = EU AND Orientation = RH',                                'id':'A00028618','name':'TLA_UNIVERSAL_ROBOTIC_LABELER_REV-D_RH_EU',          'boms':'6FT EU',            'conf':'HIGH'},
        {'num':5,  'cond':'Orientation = LH',                                                'id':'A00012904','name':'TLA_UNIVERSAL_ROBOTIC_LABELER_REV-D_LH',             'boms':'32FT LH + 10FT LH', 'conf':'HIGH'},
        {'num':6,  'cond':'Orientation = RH AND Length = 6Ft AND Outfeed Type = Intralox',  'id':'A00033459','name':'ASSY_KIT_OUTFEED_6FT_RH_INTRALOX',                   'boms':'6FT EU',            'conf':'HIGH'},
        {'num':7,  'cond':'Orientation = LH AND Length = 32Ft',                             'id':'A00023793','name':'ASSY_KIT_OUTFEED_32FT_LH',                           'boms':'32FT LH',           'conf':'HIGH'},
        {'num':8,  'cond':'Orientation = LH AND Length = 10Ft',                             'id':'A00027433','name':'ASSY_KIT_OUTFEED_10FT_LH',                           'boms':'10FT LH',           'conf':'HIGH'},
        {'num':9,  'cond':'Region = EU',                                                     'id':'A00030478','name':'KIT_CONSUMABLES_UNIVERSAL_ROBOTIC_LABELER_REV-D_EU', 'boms':'6FT EU',            'conf':'MEDIUM'},
        {'num':10, 'cond':'Region = NA',                                                     'id':'A00030474','name':'KIT_CONSUMABLES_UNIVERSAL_ROBOTIC_LABELER_REV-D_NA', 'boms':'32FT LH + 10FT LH', 'conf':'MEDIUM'},
        {'num':11, 'cond':'Region = EU',                                                     'id':'A00034338','name':'RSPL_UNIVERSAL_ROBOTIC_LABELER_REV-D_EU',            'boms':'6FT EU',            'conf':'MEDIUM'},
        {'num':12, 'cond':'Region = NA',                                                     'id':'A00023255','name':'RSPL_UNIVERSAL_ROBOTIC_LABELER_REV-D',               'boms':'32FT LH + 10FT LH', 'conf':'MEDIUM'},
        {'num':13, 'cond':'Region = EU',                                                     'id':'A00028619','name':'ASSY_KIT_LATENCY_TUNNEL_EU',                         'boms':'6FT EU',            'conf':'MEDIUM'},
        {'num':14, 'cond':'Region = NA',                                                     'id':'A00021079','name':'ASSY_KIT_LATENCY_TUNNEL',                            'boms':'32FT LH + 10FT LH', 'conf':'MEDIUM'},
        {'num':15, 'cond':'Region = NA AND Orientation = LH',                               'id':'A00028083','name':'KIT_CABLE_DRAWINGS_UNIVERSAL_ROBOTIC_LABELER_REV-D', 'boms':'32FT LH + 10FT LH', 'conf':'MEDIUM'},
        {'num':16, 'cond':'Infeed = Yes',                                                    'id':'A00031581','name':'ASSY_KIT_CONVEYOR_INFEED_EXTENSION',                 'boms':'32FT LH + 10FT LH', 'conf':'HIGH'},
        {'num':17, 'cond':'Orientation = RH AND Length = 6Ft',                              'id':'A00025815','name':'ASSY_OUTFEED_6FT_RH',                                'boms':'6FT EU',            'conf':'HIGH'},
        {'num':18, 'cond':'Orientation = LH AND Length = 32Ft',                             'id':'A00016515','name':'ASSY_OUTFEED_32FT_LH',                               'boms':'32FT LH',           'conf':'HIGH'},
        {'num':19, 'cond':'Orientation = LH AND Length = 10Ft',                             'id':'A00027126','name':'ASSY_OUTFEED_10FT_LH',                               'boms':'10FT LH',           'conf':'HIGH'},
        {'num':20, 'cond':'Outfeed Type = Intralox',                                        'id':'A00036378','name':'ASSY_OUTFEED_PANEL (Intralox)',                      'boms':'6FT EU',            'conf':'MEDIUM'},
        {'num':21, 'cond':'Outfeed Type = SWM',                                             'id':'A00034157','name':'ASSY_OUTFEED_PANEL (SWM)',                           'boms':'PENDING',           'conf':'PENDING'},
    ]

    EXCL = [
        {'num':1,  'cond':'6FT RH EU configuration selected',    'effect':'Exclude entire LH-NA branch — LH_NA_32FT + LH_NA_10FT + LH_NA_BOTH rows removed', 'type':'Implicit'},
        {'num':2,  'cond':'32FT LH NA configuration selected',   'effect':'Exclude entire EU-RH branch + LH_NA_10FT rows',                                   'type':'Implicit'},
        {'num':3,  'cond':'10FT LH NA configuration selected',   'effect':'Exclude entire EU-RH branch + LH_NA_32FT rows',                                   'type':'Implicit'},
        {'num':4,  'cond':'Orientation = RH selected',           'effect':'Exclude TLA_LH, OUTFEED_32FT_LH, OUTFEED_10FT_LH and all Orientation=LH parts',   'type':'Mutual Exclusion'},
        {'num':5,  'cond':'Orientation = LH selected',           'effect':'Exclude TLA_RH_EU, OUTFEED_6FT_RH and all Orientation=RH parts',                  'type':'Mutual Exclusion'},
        {'num':6,  'cond':'Region = EU selected',                'effect':'Exclude CONSUMABLES_NA, RSPL_standard, LATENCY_TUNNEL_NA',                         'type':'Region Incompatibility'},
        {'num':7,  'cond':'Region = NA selected',                'effect':'Exclude CONSUMABLES_EU, RSPL_EU, LATENCY_TUNNEL_EU',                               'type':'Region Incompatibility'},
        {'num':8,  'cond':'Length = 6Ft selected',               'effect':'Exclude CABLE_DRAWINGS, INFEED_EXTENSION, OUTFEED_32FT, OUTFEED_10FT',             'type':'Length Incompatibility'},
        {'num':9,  'cond':'Length = 32Ft selected',              'effect':'Exclude OUTFEED_6FT_RH_INTRALOX, OUTFEED_6FT_RH, OUTFEED_10FT_LH',                'type':'Length Incompatibility'},
        {'num':10, 'cond':'Length = 10Ft selected',              'effect':'Exclude OUTFEED_6FT_RH_INTRALOX, OUTFEED_6FT_RH, OUTFEED_32FT_LH',                'type':'Length Incompatibility'},
    ]

    APPL = [
        {'num':1,  'fam':'Region',       'sel':'Region = EU',             'assy':'RSPL_EU (A00034338)',              'evid':'6FT EU only'},
        {'num':2,  'fam':'Region',       'sel':'Region = NA',             'assy':'RSPL_standard (A00023255)',        'evid':'32FT LH + 10FT LH'},
        {'num':3,  'fam':'Region',       'sel':'Region = EU',             'assy':'KIT_CONSUMABLES_EU (A00030478)',   'evid':'6FT EU only'},
        {'num':4,  'fam':'Region',       'sel':'Region = NA',             'assy':'KIT_CONSUMABLES_NA (A00030474)',   'evid':'32FT LH + 10FT LH'},
        {'num':5,  'fam':'Region',       'sel':'Region = EU',             'assy':'LATENCY_TUNNEL_EU (A00028619)',    'evid':'6FT EU only'},
        {'num':6,  'fam':'Region',       'sel':'Region = NA',             'assy':'LATENCY_TUNNEL (A00021079)',       'evid':'32FT LH + 10FT LH'},
        {'num':7,  'fam':'Length',       'sel':'Length = 6Ft',            'assy':'OUTFEED_6FT_RH_INTRALOX (A00033459)','evid':'6FT EU only'},
        {'num':8,  'fam':'Length',       'sel':'Length = 32Ft',           'assy':'OUTFEED_32FT_LH (A00023793)',      'evid':'32FT LH only'},
        {'num':9,  'fam':'Length',       'sel':'Length = 10Ft',           'assy':'OUTFEED_10FT_LH (A00027433)',      'evid':'10FT LH only — confirmed from 3rd BOM'},
        {'num':10, 'fam':'Length',       'sel':'Length = 32Ft or 10Ft',   'assy':'CABLE_DRAWINGS (A00028083)',       'evid':'32FT LH + 10FT LH — same Part ID both'},
        {'num':11, 'fam':'Infeed',       'sel':'Infeed = Yes',            'assy':'INFEED_EXTENSION (A00031581)',     'evid':'32FT LH + 10FT LH — confirmed by 3-BOM merge'},
        {'num':12, 'fam':'Outfeed Type', 'sel':'Outfeed Type = Intralox', 'assy':'OUTFEED_PANEL Intralox (A00036378)','evid':'6FT EU — Intralox panel'},
        {'num':13, 'fam':'Outfeed Type', 'sel':'Outfeed Type = SWM',      'assy':'OUTFEED_PANEL SWM (PENDING)',      'evid':'No SWM BOM — PENDING'},
        {'num':14, 'fam':'Orientation',  'sel':'Orientation = RH',        'assy':'TLA_RH_EU (A00028618)',            'evid':'6FT EU only'},
        {'num':15, 'fam':'Orientation',  'sel':'Orientation = LH',        'assy':'TLA_LH (A00012904)',               'evid':'32FT LH + 10FT LH'},
    ]

    DFLT = [
        {'num':1,'lvl':'L1','id':'A00028412','name':'KIT_COMMISSIONING_UNIVERSAL_ROBOTIC_LABELER_REV-D'},
        {'num':2,'lvl':'L2','id':'A00021088','name':'ASSY_KIT_INFEED'},
        {'num':3,'lvl':'L2','id':'A00021067','name':'ASSY_KIT_MODULE_SCANNING'},
        {'num':4,'lvl':'L2','id':'A00021098','name':'ASSY_KIT_LABEL_APPLICATOR'},
        {'num':5,'lvl':'L2','id':'A00021096','name':'ASSY_KIT_ROBOT_TOP_FRAME'},
        {'num':6,'lvl':'L2','id':'A00021101','name':'ASSY_KIT_VERIFICATION_UNIT'},
    ]

    PAIRS = [
        {'pid':'A00033459','name':'ASSY_KIT_OUTFEED_6FT_RH_INTRALOX', 'eu':True, 'lh':False,'ft10':False,'cond':'O=RH AND L=6Ft AND OT=Intralox'},
        {'pid':'A00023793','name':'ASSY_KIT_OUTFEED_32FT_LH',          'eu':False,'lh':True, 'ft10':False,'cond':'O=LH AND L=32Ft'},
        {'pid':'A00027433','name':'ASSY_KIT_OUTFEED_10FT_LH',          'eu':False,'lh':False,'ft10':True, 'cond':'O=LH AND L=10Ft'},
        {'pid':'A00030478','name':'KIT_CONSUMABLES_EU',                 'eu':True, 'lh':False,'ft10':False,'cond':'Region = EU'},
        {'pid':'A00030474','name':'KIT_CONSUMABLES_NA',                 'eu':False,'lh':True, 'ft10':True, 'cond':'Region = NA'},
        {'pid':'A00034338','name':'RSPL_EU',                            'eu':True, 'lh':False,'ft10':False,'cond':'Region = EU'},
        {'pid':'A00023255','name':'RSPL_NA',                            'eu':False,'lh':True, 'ft10':True, 'cond':'Region = NA'},
        {'pid':'A00028619','name':'ASSY_KIT_LATENCY_TUNNEL_EU',         'eu':True, 'lh':False,'ft10':False,'cond':'Region = EU'},
        {'pid':'A00021079','name':'ASSY_KIT_LATENCY_TUNNEL',            'eu':False,'lh':True, 'ft10':True, 'cond':'Region = NA'},
        {'pid':'A00031581','name':'ASSY_KIT_CONVEYOR_INFEED_EXTENSION', 'eu':False,'lh':True, 'ft10':True, 'cond':'Infeed = Yes'},
        {'pid':'A00028083','name':'KIT_CABLE_DRAWINGS',                 'eu':False,'lh':True, 'ft10':True, 'cond':'R=NA AND O=LH'},
    ]

    MERGE = [
        {'level':0,'euRows':1,  'lhRows':1,   'ft10Rows':1,  'commonUnique':0, 'euOnlyUnique':1,'lhOnlyUnique':1,'ft10OnlyUnique':1},
        {'level':1,'euRows':5,  'lhRows':7,   'ft10Rows':7,  'commonUnique':1, 'euOnlyUnique':4,'lhOnlyUnique':2,'ft10OnlyUnique':1},
        {'level':2,'euRows':291,'lhRows':326, 'ft10Rows':326,'commonUnique':256,'euOnlyUnique':12,'lhOnlyUnique':26,'ft10OnlyUnique':20},
        {'level':3,'euRows':109,'lhRows':450, 'ft10Rows':440,'commonUnique':72,'euOnlyUnique':6,'lhOnlyUnique':50,'ft10OnlyUnique':22},
        {'level':4,'euRows':157,'lhRows':321, 'ft10Rows':312,'commonUnique':140,'euOnlyUnique':8,'lhOnlyUnique':42,'ft10OnlyUnique':20},
        {'level':5,'euRows':692,'lhRows':832, 'ft10Rows':820,'commonUnique':680,'euOnlyUnique':3,'lhOnlyUnique':12,'ft10OnlyUnique':8},
        {'level':6,'euRows':1521,'lhRows':1530,'ft10Rows':1528,'commonUnique':1515,'euOnlyUnique':2,'lhOnlyUnique':5,'ft10OnlyUnique':3},
        {'level':7,'euRows':1185,'lhRows':1194,'ft10Rows':1194,'commonUnique':1183,'euOnlyUnique':0,'lhOnlyUnique':2,'ft10OnlyUnique':0},
    ]

    return {
        'eu': eu, 'lh': lh, 'ft10': ft10, 'b150': b150,
        'val': val, 'comp': comp,
        'feat': FEAT, 'incl': INCL, 'excl': EXCL, 'appl': APPL,
        'dflt': DFLT, 'pairs': PAIRS, 'merge': MERGE,
        'stats': {
            'total': total, 'common': common_n, 'euRh': eu_rh_n,
            'lh32': lh32_n, 'lh10': lh10_n, 'lhBoth': lhboth_n,
            'pending': pending_n,
            'euRows': len(eu), 'lhRows': len(lh), 'ft10Rows': len(ft10),
        }
    }

if __name__ == '__main__':
    d = build()
    print("Data loaded successfully")
    print(f"  150%: {d['stats']['total']:,} rows")
    print(f"  COMMON: {d['stats']['common']:,}")
    print(f"  EU_RH: {d['stats']['euRh']}")
    print(f"  LH_32: {d['stats']['lh32']}")
    print(f"  LH_10: {d['stats']['lh10']}")
    print(f"  BOTH:  {d['stats']['lhBoth']}")
    print(f"  PENDING: {d['stats']['pending']}")
