<template>
  <div>
    
    
    <main class="flex-1 p-8">
      <h2 class="text-3xl font-black mb-6">User Management</h2>
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div class="flex justify-between items-center mb-6">
          <input type="text" placeholder="Search users by email..." class="border border-slate-200 rounded-lg p-2 w-64" />
        </div>
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="p-4 font-bold text-slate-600">Name</th>
              <th class="p-4 font-bold text-slate-600">Email</th>
              <th class="p-4 font-bold text-slate-600">KYC Status</th>
              <th class="p-4 font-bold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-slate-100 hover:bg-slate-50">
              <td class="p-4 font-bold text-slate-900">David O.</td>
              <td class="p-4 text-slate-600 text-sm">david@stu.ui.edu.ng</td>
              <td class="p-4"><span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Verified</span></td>
              <td class="p-4"><button class="text-red-600 font-bold hover:underline">Ban User</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>