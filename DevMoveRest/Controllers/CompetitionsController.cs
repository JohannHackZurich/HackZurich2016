using DevMoveRest.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace DevMoveRest.Controllers
{
    public class CompetitionsController : ApiController
    {
        [HttpPost]
        [Route("api/Competitions/Start")]
        public IHttpActionResult Post()
        {
            foreach(var player in PlayerService.Current.Players)
            {
                player.Steps = 0;
            }

            return Ok();
        }
    }
}