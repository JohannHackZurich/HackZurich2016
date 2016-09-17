using DevMoveRest.Models;
using DevMoveRest.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DevMoveRest.Controllers
{
    public class PlayersController : ApiController
    {
        [HttpPost]
        public Player Post(Player player)
        {
            player.Id = Guid.NewGuid();
            PlayerService.Current.Players.Add(player);

            return player;
        }

        public IHttpActionResult Get(string id)
        {
            Guid guid;

            if (!Guid.TryParse(id, out guid))
                return BadRequest("Invalid id");

            var player = PlayerService.Current.Players.Where(p => p.Id == guid).FirstOrDefault();

            if (player == null) return BadRequest("Player does not exist.");

            return Ok<Player>(player);
        }

        public IHttpActionResult Get()
        {
            return Ok<IEnumerable<Player>>(PlayerService.Current.Players);
        }

        // PUT api/avalanche/test/5
        [HttpPut]
        [Route("api/Players/{id}/Steps/{steps}")]
        public IHttpActionResult Steps(string id, int steps)
        {
            Guid guid;

            if (!Guid.TryParse(id, out guid))
                return BadRequest("Invalid id");

            var player = PlayerService.Current.Players.Where(p => p.Id == guid).FirstOrDefault();

            if (player == null) return BadRequest("Player does not exist.");

            player.Steps = steps;
            return Ok<Player>(player);
        }
        [HttpDelete]
        public IHttpActionResult Delete()
        {
            PlayerService.Current.Players.Clear();

            return Ok();
        }
    }
}
