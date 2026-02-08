import asyncio, json, os, subprocess, sys, time, urllib.request
from playwright.async_api import async_playwright

ROOT=os.path.abspath(os.path.dirname(__file__))

def wait_for_server(url,timeout=30):
    end=time.time()+timeout
    while time.time()<end:
        try:
            with urllib.request.urlopen(url,timeout=2) as r:
                if r.status==200:return True
        except Exception:pass
        time.sleep(0.5)
    return False

async def run_probe():
    async with async_playwright() as p:
        b=await p.chromium.launch(headless=True)
        page=await b.new_page(viewport={"width":1280,"height":720})
        logs=[]
        page.on('console', lambda m: logs.append(f'[{m.type}] {m.text}'))
        await page.goto('http://127.0.0.1:8089/index.html', wait_until='domcontentloaded', timeout=120000)
        await page.wait_for_timeout(45000)

        before=await page.evaluate("""() => {
            const hx=window._hx_classes||{};
            const W=hx['com.cc.worldmap.Worldmap'];
            const c=W&&W._controller?W._controller:null;
            const Game=hx['GAME']||window.GAME;
            const g=Game?(Game._instance||Game.instance):null;
            return {
                hasController: !!c,
                flags: c?{
                    home:c._hasHomeBaseData,map:c._hasMapHeader,shared:c._hasSharedConfigs,base:c._hasBaseInfo,visible:c._hasVisibleEntityInfo,dep:c._hasDepositInfo,tune:c._hasTuningData
                }:null,
                worldMapReady: !!(g&&g.worldMap),
                mapId: g?g.map_id:null,
                hasFinishedLoading: W?W.get_hasFinishedLoading():null,
                hasReceivedAllInfo: c&&c.get_hasReceivedAllInfo?c.get_hasReceivedAllInfo():null,
            };
        }""")
        print('BEFORE', json.dumps(before, ensure_ascii=True))

        inject=await page.evaluate("""() => {
            const hx = window._hx_classes || {};
            const Worldmap = hx['com.cc.worldmap.Worldmap'];
            const controller = Worldmap && Worldmap._controller ? Worldmap._controller : null;
            if (!controller) return {ok:false, reason:'no controller'};

            const VisibleSectorUpdate = hx['com.kixeye.net.proto.atlas.VisibleSectorUpdate'];
            const Sector = hx['com.kixeye.net.proto.atlas.Sector'];
            const Region = hx['com.kixeye.net.proto.atlas.Region'];
            const RegionTemplate = hx['com.kixeye.net.proto.atlas.RegionTemplate'];
            const VisibleEntityUpdate = hx['com.kixeye.net.proto.atlas.VisibleEntityUpdate'];
            const MapEntity = hx['com.kixeye.net.proto.atlas.MapEntity'];
            const Coord = hx['com.kixeye.net.proto.atlas.Coord'];
            const Attribute = hx['com.kixeye.net.proto.atlas.Attribute'];
            const ja = window.ja;
            if (!VisibleSectorUpdate || !Sector || !Region || !RegionTemplate || !VisibleEntityUpdate || !MapEntity || !Coord || !Attribute) {
                return {ok:false, reason:'missing atlas classes'};
            }

            const playerId = ja && ja.playerInfo && ja.playerInfo.get_id ? ja.playerInfo.get_id() : 123456;\n            if (controller.getSectorData) { try { controller.getSectorData(); } catch (_) {} }
            const sectorId = 1;
            const mapId = 1;
            const regionId = 1;
            const checksum = 10101;

            try {
                const vsu = new VisibleSectorUpdate();
                const sec = new Sector();
                sec.set_id(sectorId);
                sec.set_type(1);
                sec.set_mapId(mapId);

                const reg = new Region();
                reg.set_id(regionId);
                reg.set_templateChecksum(checksum);
                sec.get_regions().push(reg);
                vsu.get_sectors().push(sec);

                controller.onVisibleSectorUpdate({ update: vsu });

                const rt = new RegionTemplate();
                rt.set_checksum(checksum);
                rt.set_layout(3);
                rt.set_stride(1);
                rt.set_cells([0]);
                controller.onRegionTemplate(rt);

                controller.OnSharedConfigsInfo({ configs: [] });

                const veu = new VisibleEntityUpdate();
                const home = new MapEntity();
                home.set_entityId(500001);
                home.set_type(1);
                home.set_ownerId(playerId);
                home.set_status(1);

                const coord = new Coord();
                coord.set_sector(sectorId);
                coord.set_region(regionId);
                coord.set_x(500);
                coord.set_y(500);
                home.set_coord(coord);

                const attrDp = new Attribute();
                attrDp.set_key('dp');
                attrDp.set_value('0');
                home.get_attributes().push(attrDp);

                const attrThorium = new Attribute();
                attrThorium.set_key('thoriumTotal');
                attrThorium.set_value('0');
                home.get_attributes().push(attrThorium);

                veu.get_entities().push(home);
                controller.onVisibleEntityUpdate({ get_response: () => veu });

                controller.receivedDepositInfo(false);
                controller.onTuningDataError({});

                return {
                    ok:true,
                    flags:{
                        home:controller._hasHomeBaseData,
                        map:controller._hasMapHeader,
                        shared:controller._hasSharedConfigs,
                        base:controller._hasBaseInfo,
                        visible:controller._hasVisibleEntityInfo,
                        dep:controller._hasDepositInfo,
                        tune:controller._hasTuningData
                    },
                    all: controller.get_hasReceivedAllInfo ? controller.get_hasReceivedAllInfo() : null
                };
            } catch (e) {
                return {ok:false, reason:String(e), stack:e && e.stack ? String(e.stack) : null};
            }
        }""")
        print('INJECT', json.dumps(inject, ensure_ascii=True))

        await page.wait_for_timeout(5000)
        after=await page.evaluate("""() => {
            const hx=window._hx_classes||{};
            const W=hx['com.cc.worldmap.Worldmap'];
            const c=W&&W._controller?W._controller:null;
            const Game=hx['GAME']||window.GAME;
            const g=Game?(Game._instance||Game.instance):null;
            return {
                flags: c?{
                    home:c._hasHomeBaseData,map:c._hasMapHeader,shared:c._hasSharedConfigs,base:c._hasBaseInfo,visible:c._hasVisibleEntityInfo,dep:c._hasDepositInfo,tune:c._hasTuningData
                }:null,
                hasReceivedAllInfo: c&&c.get_hasReceivedAllInfo?c.get_hasReceivedAllInfo():null,
                worldMapReady: !!(g&&g.worldMap),
                mapId: g?g.map_id:null,
                hasFinishedLoading: W?W.get_hasFinishedLoading():null,
                worldHasReceivedAllInfo: W?W.get_hasReceivedAllInfo():null,
            };
        }""")
        print('AFTER', json.dumps(after, ensure_ascii=True))
        await page.screenshot(path='manual_inject_result.png')
        print('screenshot manual_inject_result.png')

        print('\n--- LOG TAIL ---')
        for line in logs[-120:]:
            low=line.lower()
            if any(k in low for k in ['error','warn','worldmap','patch','disconnect']):
                print(line)

        await b.close()

def main():
    out_f=open(os.path.join(ROOT,'tmp_manual_inject_server_out.log'),'w',encoding='utf-8')
    err_f=open(os.path.join(ROOT,'tmp_manual_inject_server_err.log'),'w',encoding='utf-8')
    proc=subprocess.Popen([sys.executable,'server.py'],cwd=ROOT,stdout=out_f,stderr=err_f,text=True)
    try:
        if not wait_for_server('http://127.0.0.1:8089/index.html',45):
            print('server not ready',file=sys.stderr);return 2
        asyncio.run(run_probe());return 0
    finally:
        try:proc.terminate();proc.wait(timeout=10)
        except Exception:
            try:proc.kill()
            except Exception:pass
        out_f.close();err_f.close()

if __name__=='__main__':
    raise SystemExit(main())
