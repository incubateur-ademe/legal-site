import { config } from "@/config";

export interface MatomoResult {
  nbPageViews: number;
  nbUniqPageViews: number;
  nbVisits: number;
}

namespace MatomoApi {
  export namespace VisitsSummary {
    export interface GetVisits {
      value?: number;
    }
  }

  export namespace Actions {
    export interface Get {
      nb_pageviews?: number;
      nb_uniq_pageviews?: number;
    }
  }
}

export const fetchMatomoData = async (): Promise<MatomoResult> => {
  const MATOMO_URL = [
    `${config.matomo.url}/?module=API&method=VisitsSummary.getVisits&idSite=${
      config.matomo.siteId
    }&format=JSON&period=year&date=today&segment=${encodeURIComponent(`pageUrl=^${config.host}`)}`,
    `${config.matomo.url}/?module=API&method=Actions.get&idSite=${
      config.matomo.siteId
    }&format=JSON&period=year&date=today&segment=${encodeURIComponent(`pageUrl=^${config.host}`)}`,
  ];
  const promises = MATOMO_URL.map(url =>
    fetch(url, {
      next: {
        revalidate: 60 * 60 * 8, // 24 hours
      },
    })
      .then(data => data.json())
      .catch(() => {
        return null;
      }),
  );
  const [nbVisitData, infoData] = (await Promise.all(promises)) as [
    MatomoApi.VisitsSummary.GetVisits,
    MatomoApi.Actions.Get,
  ];
  return {
    nbPageViews: infoData?.nb_pageviews ?? 0,
    nbUniqPageViews: infoData?.nb_uniq_pageviews ?? 0,
    nbVisits: nbVisitData?.value ?? 0,
  };
};
