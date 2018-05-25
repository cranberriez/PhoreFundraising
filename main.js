const ADDR = "PNvGNe9b8FCyt5aVnB12Z6AjaKNXvU77Ca";
var currentBal;

function getBalance() {
  $.ajax({
    url: 'https://rpc.phore.io/rpc',
    dataType: 'json',
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({
      method: "searchrawtransactions",
      params: [ADDR, 1, 0, 10000],
      jsonrpc: "2.0"
    }),
    processData: false,
    success: function(data, textStatus, jQxhr) {
      let balance = 0;
      let prevtxs = {};
      for (let tx of data.result) {
	      prevtxs[tx.txid] = tx;
        for (let vin of tx.vin) {
          if (prevtxs.hasOwnProperty(vin.txid)) {
            balance -= prevtxs[vin.txid].vout[vin.vout].value;
      	  }
      	}
        for (let vout of tx.vout) {
          if (vout.scriptPubKey.addresses && vout.scriptPubKey.addresses.indexOf(ADDR) != -1) {
            balance += vout.value;
          }
        }
      }
      console.log(balance);
      bal = Math.round(balance)
      $('#balance').text(bal)
      var value = bal/50000
      $('#circle').circleProgress({
      	value : value,
      	fill: {
      		color: '#00d188'
      	}
      });
    },
    error: function(jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  });
}

$(function(){
  $('.copytext').hide()
  getBalance()
  setInterval(function(){
    getBalance()
  }, 60000)

  $('.refresh').on('click', function() {
    $('.refresh i').addClass('fa-spin')
    setTimeout(function(){
      $('.refresh i').removeClass('fa-spin')
    }, 2000)
  })

  $('.donateB').on('click', function() {
    $('.donate-pop').removeClass('hidden')
  })

  $('.close').on('click', function() {
    $('.donate-pop').addClass('hidden')
  })

  $('.address').on('click', function() {
    $('.address').select();
    document.execCommand("copy");
    $('.copytext').fadeIn('fast')
    setTimeout(function(){
      $('.copytext').fadeOut('slow')
    }, 500)
  })
})


var progressBarOptions = {
	startAngle: -1.565,
	size: $(window).height()/1.4,
  value: 0,
  fill: {
		color: '#fff'
	}
}

$('.circle').circleProgress(progressBarOptions).on('circle-animation-progress', function(event, progress, stepValue) {});

$(window).resize(function(){
  $('.circle').circleProgress({
    size: $(window).height()/1.5
  });
})
